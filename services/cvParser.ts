import OpenAI from "openai";
import fs from "fs";
import pdf from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyse un fichier PDF de CV et retourne un JSON structuré.
 * @param filePath Chemin du fichier PDF
 * @returns JSON contenant les sections du CV
 */
export const parseCV = async (filePath: string): Promise<string> => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(fileBuffer);
    const extractedText = pdfData.text;

    const prompt = `
Voici un CV :

${extractedText}

Merci de l'analyser et de retourner un objet JSON clair et bien formaté avec les sections suivantes :

- informations_personnelles (nom, email, téléphone, adresse, linkedin, date_naissance)
- formations (diplôme, école, ville, dates, détails)
- experiences_professionnelles (poste, entreprise, lieu, dates, missions)
- competences (par catégories si possible)
- certifications (nom de la certification, organisme délivreur, date si disponible)
- langues (langue + niveau)
- centres_interet (liste)

Respecte strictement le format JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant expert en extraction de données de CV.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message?.content;

    return response || "";
  } catch (error) {
    console.error("Erreur dans parseCV :", error);
    throw new Error("Impossible d'analyser le CV");
  }
};
