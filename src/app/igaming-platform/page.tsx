export default function IgamingPlatformPage() {
    return (
        <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", color: 'white', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1>Casino Platform Demo for iGaming Projects</h1>
            <p style={{color:'white'}}>
                <strong>Contact:</strong>{" "}
                <a style={{color: 'white'}} href="mailto:evidacasino@gmail.com">
                    evidacasino@gmail.com
                </a>
            </p>

            <p>
                This is a technical demo of a casino / iGaming platform.
                The project demonstrates frontend UI, admin panel logic,
                wallet and balance flows, and user management.
            </p>

            <p>
                <strong>This is NOT a live casino.</strong><br />
                Games and payment providers are not integrated.
                The platform is built as a software demo for startups,
                affiliates, and iGaming projects.
            </p>

            <h2 style={{textAlign: 'left'}}>Key features:</h2>
            <ul style={{color: 'white'}}>
                <li>User authentication and profiles</li>
                <li>Wallet and balance logic</li>
                <li>Admin dashboard</li>
                <li>Verification and status flows</li>
            </ul>

            <p>
                <strong>Looking for iGaming projects, contracts, or partnerships.</strong>
            </p>
        </main>
    );
}
