import json
import httpx

def handler(event, context):
    try:
        url = "https://www.figuremarkets.com/service-hft-exchange/api/v1/trades/HASH-USD?size=1"
        
        with httpx.Client() as client:
            response = client.get(url)
            response.raise_for_status()
            data = response.json()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(data)
        }
        
    except httpx.RequestError as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': f'Request error: {str(e)}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'})
        }
