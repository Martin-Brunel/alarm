import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  code: string;
  command: "ARM" | "DISARM";
  to: string; // Ajout du numéro de téléphone destinataire
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { code, command, to } = body;


    if (!code || code.length !== 4 || !/^\d{4}$/.test(code)) {
      return NextResponse.json({ message: "Code invalide" }, { status: 400 });
    }

    if (command !== "ARM" && command !== "DISARM") {
      return NextResponse.json(
        { message: "Commande invalide" },
        { status: 400 }
      );
    }

    if (!to || to.replace("+33", "0") !== process.env.ALARM_PHONE_NUMBER) {
      return NextResponse.json(
        { message: "Numéro de téléphone manquant" },
        { status: 400 }
      );
    }

    // Ici, vous devrez implémenter l'appel à l'API de votre fournisseur SMS
    // Exemple fictif:
    /*
    const response = await fetch('https://votre-fournisseur-sms.com/api/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to, // Utilisation du numéro fourni par l'utilisateur
        message: `${code}${command}`,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi du SMS');
    }
    }
    */
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR');
    const timeStr = now.toLocaleTimeString('fr-FR');
    
    await axios.get("https://smsapi.free-mobile.fr/sendmsg", {
      params: {
        user: process.env.ALARM_PHONE_USER,
        pass: process.env.ALARM_PHONE_PASS,
        msg: `${code}${command}`,
      },
    });
    
    // Log amélioré avec emoji et formatage plus lisible
    const commandEmoji = command === "ARM" ? "🔒" : "🔓";
    console.log(`📱 SMS envoyé | ${commandEmoji} ${command} | Code: ${code} | Destinataire: ${to} | ${dateStr} à ${timeStr}`);
    
    return NextResponse.json({ success: true }, { status: 200 });
    // Pour le moment, simulons une réponse réussie
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi du SMS" },
      { status: 500 }
    );
  }
}
