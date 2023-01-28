const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Formats the given response body as a Lambda proxy response
 * @param {object} body
 * @returns the response
 */
export const formatJsonResponse = (body) => {
    return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify(body),
    };
};

/**
 * Formats the given error as a Lambda proxy response
 * @param {number} statusCode
 * @param {object} error
 * @returns the response
 */
export const formatJsonError = (error) => {
    return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({ error }),
    };
};
