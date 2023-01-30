from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import spacy

app = FastAPI()

md_nlp = spacy.load('en_core_sci_md')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/entity-info")
async def entity_info(text: str):
    doc = md_nlp(text)
    sentences = [sent for sent in doc.sents]
    entities_per_sentence = []
    for sent in sentences:
        sent_doc = md_nlp(sent.text)
        entities = [{"text": ent.text, "label": ent.label_} for ent in sent_doc.ents]
        entities_per_sentence.append(entities)
    return {"sentences": entities_per_sentence}

@app.post("/entity-info-check/")
async def entity_info_check(text: str = Body(..., embed=True)):
    doc = md_nlp(text)
    sentences = [sent for sent in doc.sents]
    entities_per_sentence = []
    for sent in sentences:
        sent_doc = md_nlp(sent.text)
        entities = [{"text": ent.text, "label": ent.label_} for ent in sent_doc.ents]
        for entity in entities:
            if entity['text'] not in [e['text'] for e in entities_per_sentence]:
                entities_per_sentence.append(entity)
    return {"sentences": entities_per_sentence}


if __name__ == "__main__":
    uvicorn.run("scispacyAPI:app", host="0.0.0.0", port=8000, reload=True)