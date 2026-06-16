export default async function Home() {
  async function getExternalData() {
    const apiKey = process.env.EXTERNAL_API_KEY; // Safe from client exposure

    const response = await fetch('https://example.com', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Next.js specific caching options:
      next: { revalidate: 3600 }, // Cache data for 1 hour (3600 seconds)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch external API data');
    }

    return response.json();
  }

  return (
    <main className="container mx-auto p-4 flex-1">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">This is the main page of the application.</p>
    </main>
  );
}
