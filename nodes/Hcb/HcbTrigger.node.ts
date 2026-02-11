import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

interface PollData {
	lastItemDate?: string;
}

const BASE_URL = 'https://hcb.hackclub.com';

export class HcbTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HCB Trigger',
		name: 'hcbTrigger',
		icon: 'file:hcb.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["resource"]}}',
		description:
			'Triggers when new transactions or donations appear on an HCB organization',
		defaults: {
			name: 'HCB Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Trigger on new transactions',
					},
					{
						name: 'Donation',
						value: 'donation',
						description: 'Trigger on new donations',
					},
				],
				default: 'transaction',
				required: true,
			},
			{
				displayName: 'Organization ID or Slug',
				name: 'organizationId',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. hackclub or org_abc123',
				description:
					'The organization ID or slug (must have Transparency Mode enabled)',
			},
			{
				displayName: 'Expand',
				name: 'expand',
				type: 'string',
				default: '',
				placeholder: 'e.g. organization,user',
				description:
					'Object types to expand in the response (comma-separated)',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const pollData = this.getWorkflowStaticData('node') as PollData;
		const resource = this.getNodeParameter('resource') as string;
		const orgId = this.getNodeParameter('organizationId') as string;
		const expand = this.getNodeParameter('expand', '') as string;

		const apiPath = resource === 'donation' ? 'donations' : 'transactions';
		const endpoint = `/api/v3/organizations/${encodeURIComponent(orgId)}/${apiPath}`;

		const qs: IDataObject = { per_page: 100 };
		if (expand) {
			qs.expand = expand;
		}

		const options: IHttpRequestOptions = {
			method: 'GET',
			url: `${BASE_URL}${endpoint}`,
			qs,
			json: true,
		};

		const items = (await this.helpers.httpRequest(options)) as IDataObject[];

		if (!Array.isArray(items) || items.length === 0) {
			return null;
		}

		if (this.getMode() === 'manual') {
			const first = items.slice(0, 1);
			return [this.helpers.returnJsonArray(first)];
		}

		const lastDate = pollData.lastItemDate;

		const dateField = 'date';
		const idField = 'id';

		const newestDate = items.reduce((max, item) => {
			const d = item[dateField] as string | undefined;
			if (!d) return max;
			return !max || new Date(d) > new Date(max) ? d : max;
		}, '' as string);

		let newItems: IDataObject[];

		if (!lastDate) {
			newItems = items.slice(0, 1);
		} else {
			const lastDateParsed = new Date(lastDate).getTime();
			newItems = items.filter((item) => {
				const d = item[dateField] as string | undefined;
				if (!d) return false;
				const itemDate = new Date(d).getTime();
				if (itemDate > lastDateParsed) return true;
				if (itemDate === lastDateParsed) {
					return (item[idField] as string) !== pollData.lastItemDate;
				}
				return false;
			});
		}

		if (newestDate) {
			pollData.lastItemDate = newestDate;
		}

		if (newItems.length === 0) {
			return null;
		}

		return [this.helpers.returnJsonArray(newItems)];
	}
}
