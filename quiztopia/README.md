Examin - Vendela Leitner Norinder - Quiztopia

Bakgrund
Välkommen till Quiztopia - vi är inte bara ett företag, vi är en revolution. Vi är ett gäng tekniknördar baserade i Göteborg, som älskar att utforska städer och göra det på det mest nördiga sättet möjligt - genom en webbapp. Vi är som en GPS på steroider, men istället för att bara berätta vart du ska gå, ger vi dig frågor baserade på platsen du befinner dig på. Det är som att ha en liten Jeopardy!-spelshow i fickan.

Vår app är som en interaktiv stadsvandring, men med en twist. Varje korrekt svar ger poäng, vilket gör det till en rolig upplevelse. Det är som att spela Pokémon Go, men istället för att fånga Pokémon, fångar du kunskap.

Instruktioner
Beskrivning av vad som ska byggas, kravspecifikationen och de tekniska krav.

Kravspecifikation
Det går att skapa konto och logga in.
Det går att se alla quiz, vad quiz:et heter samt vem som skapat det.
Det går att välja ett specifikt quiz och få alla frågor.
Kräver inloggning

För nedan funktionalitet är det enbart på sin egen användare man kan arbeta på. Alltså du kan exempelvis inte ta bort någon annans quiz.

Det går att skapa ett quiz.
Det går att lägga till frågor på ett skapat quiz.
En fråga innehåller: Frågan, svaret samt koordinater på kartan (longitud och latitud, dessa kan vara påhittade och måste inte vara riktiga koordinater).
Det går att ta bort ett quiz.
VG-krav

Det finns en "leaderboard" över vilka spelare som fått flest poäng på varje quiz. Här kommer man behöva ha två endpoints, en för att registrera poäng för en användare och en endpoint för att hämta topplista över poäng och användare för ett quiz.
Du ska ha en policy i din serverless framework - yaml där du beskrivit exakt de tjänster och "actions" som ditt projekt behöver för att köra. Detta kan vara global och gälla alla lambda-funktioner. Du ska alltså inte använda dig av en roll här.
Tekniska krav
Serverless framework
Middy
JSON Web Token
API Gateway
AWS Lambda
DynamoDB
Betygskriterier
För Godkänt:

Uppfyller alla krav i kravspecifikationen.
Uppfyller alla tekniska krav.
För Väl Godkänt:

Uppfyller alla krav i kravspecifikationen inklusive VG-kraven.
