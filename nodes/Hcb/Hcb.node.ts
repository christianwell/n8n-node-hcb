import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import {
	hcbApiRequest,
	hcbApiRequestAllItems,
	buildGetAllOperation,
	toExecutionData,
} from './GenericFunctions';
import { hcbFields } from './descriptions';

export class Hcb implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HCB',
		name: 'hcb',
		icon: 'file:hcb.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Read public data from HCB (Hack Club Bank) organizations with Transparency Mode enabled',
		defaults: {
			name: 'HCB',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		requestDefaults: {
			baseURL: 'https://hcb.hackclub.com',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: hcbFields,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const apiPaths: Record<string, string> = {
			transaction: 'transactions',
			cardCharge: 'card_charges',
			donation: 'donations',
			invoice: 'invoices',
			check: 'checks',
			achTransfer: 'ach_transfers',
			transfer: 'transfers',
			wireTransfer: 'wire_transfers',
			wiseTransfer: 'wise_transfers',
			checkDeposit: 'check_deposits',
			reimbursedExpense: 'reimbursed_expenses',
			hcbFee: 'hcb_fees',
			card: 'cards',
			activity: 'activities',
		};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'organization') {
					if (operation === 'getAll') {
						const { qs, returnAll, limit } = buildGetAllOperation(this, i);

						if (returnAll) {
							const data = await hcbApiRequestAllItems.call(
								this,
								'GET',
								'/api/v3/organizations',
								qs,
							);
							returnData.push(...toExecutionData(data));
						} else {
							qs.per_page = limit;
							const data = await hcbApiRequest.call(
								this,
								'GET',
								'/api/v3/organizations',
								qs,
							);
							const results = Array.isArray(data) ? data.slice(0, limit) : [data];
							returnData.push(...toExecutionData(results));
						}
					} else if (operation === 'get') {
						const orgId = this.getNodeParameter('organizationId', i) as string;
						const expand = this.getNodeParameter('expand', i, '') as string;
						const qs: IDataObject = {};
						if (expand) qs.expand = expand;

						const data = await hcbApiRequest.call(
							this,
							'GET',
							`/api/v3/organizations/${encodeURIComponent(orgId)}`,
							qs,
						);
						returnData.push(...toExecutionData(data));
					}
				} else if (resource === 'activity') {
					if (operation === 'getAll') {
						const { qs, returnAll, limit } = buildGetAllOperation(this, i);

						if (returnAll) {
							const data = await hcbApiRequestAllItems.call(
								this,
								'GET',
								'/api/v3/activities',
								qs,
							);
							returnData.push(...toExecutionData(data));
						} else {
							qs.per_page = limit;
							const data = await hcbApiRequest.call(
								this,
								'GET',
								'/api/v3/activities',
								qs,
							);
							const results = Array.isArray(data) ? data.slice(0, limit) : [data];
							returnData.push(...toExecutionData(results));
						}
					} else if (operation === 'get') {
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						const expand = this.getNodeParameter('expand', i, '') as string;
						const qs: IDataObject = {};
						if (expand) qs.expand = expand;

						const data = await hcbApiRequest.call(
							this,
							'GET',
							`/api/v3/activities/${encodeURIComponent(resourceId)}`,
							qs,
						);
						returnData.push(...toExecutionData(data));
					}
				} else {
					const apiPath = apiPaths[resource];

					if (operation === 'getAll') {
						const orgId = this.getNodeParameter('organizationId', i) as string;
						const { qs, returnAll, limit } = buildGetAllOperation(this, i);

						const endpoint = `/api/v3/organizations/${encodeURIComponent(orgId)}/${apiPath}`;

						if (returnAll) {
							const data = await hcbApiRequestAllItems.call(this, 'GET', endpoint, qs);
							returnData.push(...toExecutionData(data));
						} else {
							qs.per_page = limit;
							const data = await hcbApiRequest.call(this, 'GET', endpoint, qs);
							const results = Array.isArray(data) ? data.slice(0, limit) : [data];
							returnData.push(...toExecutionData(results));
						}
					} else if (operation === 'get') {
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						const expand = this.getNodeParameter('expand', i, '') as string;
						const qs: IDataObject = {};
						if (expand) qs.expand = expand;

						const data = await hcbApiRequest.call(
							this,
							'GET',
							`/api/v3/${apiPath}/${encodeURIComponent(resourceId)}`,
							qs,
						);
						returnData.push(...toExecutionData(data));
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
