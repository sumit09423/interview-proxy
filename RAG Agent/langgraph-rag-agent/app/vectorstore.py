"""FAISS vector store setup and retrieval."""

from pathlib import Path

from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import use_groq


def _project_root() -> Path:
    """Get project root (parent of app/)."""
    return Path(__file__).resolve().parent.parent


def load_knowledge_base(path: str | Path | None = None) -> str:
    """Load knowledge base from file."""
    path = Path(path or _project_root() / "data" / "knowledge_base.txt")
    if not path.exists():
        raise FileNotFoundError(f"Knowledge base not found: {path}")
    return path.read_text(encoding="utf-8")


def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:
    """Split text into chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_text(text)


def _get_embeddings():
    """Return embeddings: HuggingFace when using Groq, OpenAI otherwise."""
    if use_groq():
        return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return OpenAIEmbeddings(model="text-embedding-3-small")


def build_vector_store(
    knowledge_base_path: str | Path | None = None,
    persist_path: str | Path | None = None,
) -> FAISS:
    """Build FAISS vector store from knowledge base."""
    kb_path = knowledge_base_path or _project_root() / "data" / "knowledge_base.txt"
    text = load_knowledge_base(kb_path)
    chunks = chunk_text(text)

    embeddings = _get_embeddings()
    vectorstore = FAISS.from_texts(chunks, embeddings)

    if persist_path:
        Path(persist_path).mkdir(parents=True, exist_ok=True)
        vectorstore.save_local(str(persist_path))

    return vectorstore


def get_vector_store(
    knowledge_base_path: str | Path | None = None,
    persist_path: str | Path | None = None,
) -> FAISS:
    """Get or build FAISS vector store."""
    root = _project_root()
    subdir = "faiss_index_hf" if use_groq() else "faiss_index"
    persist_path = Path(persist_path or root / "data" / subdir)
    index_file = persist_path / "index.faiss"

    embeddings = _get_embeddings()
    if index_file.exists():
        return FAISS.load_local(str(persist_path), embeddings, allow_dangerous_deserialization=True)

    vectorstore = build_vector_store(knowledge_base_path or root / "data" / "knowledge_base.txt", persist_path)
    return vectorstore
