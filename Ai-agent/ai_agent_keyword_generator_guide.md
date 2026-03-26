# AI Agent Keyword Generator -- Simple Explanation & Implementation Guide

## 1. Project Requirement

Build an AI agent system that takes product metadata (title and
description) and returns the top 20 ranked trending keywords.

These keywords can be used for SEO, ads, and product listings.

Example:

Input:

Title: Wireless Noise Cancelling Headphones

Description: Bluetooth over-ear headphones with deep bass and long
battery life

Output:

1\. bluetooth headphones

2\. wireless headphones

3\. noise cancelling headphones

\... up to 20 keywords

## 2. What the System Is Trying to Build

This system is a multi-agent AI workflow where several AI agents work
together to produce better results.

Flow:

User → Chatbot → Agent System → External APIs → Ranked Keywords

## 3. Agents in the System

Agent 1: Keyword Enrichment Agent

\- Fix typos and spelling mistakes

\- Generate related keywords

\- Tool: Datamuse API

Agent 2: Keyword Validation Agent

\- Remove irrelevant keywords

\- Remove age-restricted or policy-violating keywords

\- Clean and filter keyword list

Agent 3: Ranking Agent

\- Rank keywords based on search popularity

\- Tool: Google SERP API

## 4. Full Workflow

1\. User enters product title and description

2\. Chatbot sends request to backend

3\. Keyword Enrichment Agent generates related keywords

4\. Keyword Validation Agent removes bad keywords

5\. Ranking Agent sorts keywords by popularity

6\. System returns the Top 20 ranked keywords

## 5. Technologies Suggested

Frontend:

\- React / Vue / Angular

Backend:

\- Node.js or Python

Agent Framework:

\- Microsoft Agent Framework

APIs:

\- Datamuse API

\- SERP API

LLM Service:

\- Azure AI Foundry

## 6. Simple Implementation Steps

Step 1 -- Create Backend

Use Node.js + Express or Python + FastAPI.

Step 2 -- Create API Endpoint

POST /generate-keywords

Input JSON:

{

\"title\": \"\",

\"description\": \"\"

}

Step 3 -- Call Datamuse API

Generate related keywords using:

https://api.datamuse.com/words?ml=keyword

Step 4 -- Validate Keywords

Remove:

\- duplicates

\- banned words

\- irrelevant keywords

Step 5 -- Rank Keywords

Use SERP API to check search popularity and rank them.

Step 6 -- Return Top 20 Keywords

Return ranked keyword list to the frontend chatbot.

## 7. Simple Architecture

React Chatbot

↓

Backend API (Node.js / Python)

↓

Agent Workflow

↓

Datamuse API (Keyword generation)

↓

SERP API (Keyword ranking)

↓

Return Top 20 Ranked Keywords

## 8. What Interviewers Usually Test

Understanding of:

\- AI agents

\- API integration

\- workflow design

\- system architecture

\- practical implementation
