import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';

const BASE_URL = 'https://hcb.hackclub.com';

export async function hcbApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const options: IHttpRequestOptions = {
		method,
		url: `${BASE_URL}${endpoint}`,
		qs,
		json: true,
	};

	return this.helpers.httpRequest(options);
}

export async function hcbApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const perPage = 100;

	qs.per_page = perPage;

	let hasMore = true;
	while (hasMore) {
		qs.page = page;

		const options: IHttpRequestOptions = {
			method,
			url: `${BASE_URL}${endpoint}`,
			qs,
			json: true,
			returnFullResponse: true,
		};

		const response = await this.helpers.httpRequest(options) as unknown as {
			body: IDataObject[];
			headers: Record<string, string>;
		};

		const items = Array.isArray(response.body) ? response.body : [];
		returnData.push(...items);

		const totalPages = parseInt(response.headers['x-total-pages'] as string, 10);
		if (isNaN(totalPages) || page >= totalPages) {
			hasMore = false;
		} else {
			page++;
		}
	}

	return returnData;
}

export function buildGetAllOperation(
	ctx: IExecuteFunctions,
	itemIndex: number,
): { qs: IDataObject; returnAll: boolean; limit: number } {
	const returnAll = ctx.getNodeParameter('returnAll', itemIndex) as boolean;
	const limit = ctx.getNodeParameter('limit', itemIndex, 50) as number;
	const expand = ctx.getNodeParameter('expand', itemIndex, '') as string;

	const qs: IDataObject = {};
	if (expand) {
		qs.expand = expand;
	}

	return { qs, returnAll, limit };
}

export function toExecutionData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	const items = Array.isArray(data) ? data : [data];
	return items.map((item) => ({ json: item }));
}
