export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://extrafancy.co',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUB_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: true,
          send_welcome_email: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.message || 'Subscription failed' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://extrafancy.co',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
