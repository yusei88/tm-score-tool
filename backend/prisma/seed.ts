import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Minimal sample data for local development / CI seed
    const session = await prisma.gameSession.create({
        data: {
            owner_id: "00000000-0000-0000-0000-000000000000",
            status: "pending",
            current_generation: 0,
            state_version: 1,
            global_metrics: { oxygen: 0, temperature: 0, ocean: 0 },
        },
    });

    // Create multiple players for the session
    const playerNames = ["Host", "Alice", "Bob", "Carol"];

    const createdPlayers = [] as Array<{
        player_id: string;
        display_name: string;
    }>;

    for (const name of playerNames) {
        const p = await prisma.player.create({
            data: {
                session_id: session.session_id,
                display_name: name,
                resources: { mc: 0, steel: 0, titanium: 0, plants: 0, energy: 0, heat: 0 },
                TR: 0,
                milestones: [],
                awards: [],
                connected: name === "Host",
            },
        });
        createdPlayers.push({ player_id: p.player_id, display_name: p.display_name });
    }

    console.log("Seeded session and players:", { session_id: session.session_id, players: createdPlayers });
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
