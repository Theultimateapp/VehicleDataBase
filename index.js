import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Head>
        <title>Adacko Analytics</title>
      </Head>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Adacko Analytics – Live Fitment Data</h1>

      <iframe
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4V58dzbn1kgSkIEvTyMf-YBzRzrSnYN2Yx3Qxx5z9MJff1hStXeEDxZQBDsQWmu8g_zKICtUPNWef/pubhtml?widget=true&amp;headers=false"
        width="100%"
        height="600"
        style={{ border: '1px solid #ccc', borderRadius: '6px' }}
        allowFullScreen
        title="Live Fitment Sheet"
      ></iframe>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📊 Brand Completion Tracker</h2>
        <div style={{ background: '#eee', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{
            background: '#4caf50',
            height: '100%',
            width: '5%'
          }}></div>
        </div>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>5% of brands completed</p>
      </div>
    </div>
  );
}