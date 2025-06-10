exports.handler = async (event, context) => {
  try {
    // Get the full path from the event
    const path = event.path || event.rawUrl || '';
    
    // Extract token pair from path like /price/HASH-USD
    const pathMatch = path.match(/\/price\/([A-Z]+-[A-Z]+)$/);
    
    let tokenPair;
    
    if (pathMatch && pathMatch[1]) {
      // Path routing: /price/HASH-USD
      tokenPair = pathMatch[1];
    } else if (event.queryStringParameters && event.queryStringParameters.pair) {
      // Fallback to query parameter
      tokenPair = event.queryStringParameters.pair;
    } else {
      // Default to HASH-USD if no pair specified
      tokenPair = 'HASH-USD';
    }
    
    // Validate token pair format
    if (!/^[A-Z]+-[A-Z]+$/.test(tokenPair)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Invalid token pair format. Use format: BTC-USD, ETH-USD, etc.",
          usage: "Use URL like: /price/HASH-USD or /price/ETH-USD"
        })
      };
    }
    
    const url = `https://www.figuremarkets.com/service-hft-exchange/api/v1/trades/${tokenPair}?size=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for ${tokenPair}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        tokenPair: tokenPair,
        ...data
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};