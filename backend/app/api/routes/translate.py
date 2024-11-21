from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from googletrans import Translator

router = APIRouter()
translator = Translator()

class TranslateRequest(BaseModel):
    text: str
    sourceLanguage: str
    targetLanguage: str

@router.post("/translate")
async def translate(request: TranslateRequest):
    try:
        translated_text = translate_text(
        request.text,
        request.sourceLanguage,
        request.targetLanguage
        )
        return {
            "translation": translated_text,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def translate_text(text: str, source_lang: str, target_lang: str):
    translation = translator.translate(text, src=source_lang, dest=target_lang)
    return translation.text