import type { INodeProperties } from 'n8n-workflow';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Activity', value: 'activity' },
		{ name: 'ACH Transfer', value: 'achTransfer' },
		{ name: 'Card', value: 'card' },
		{ name: 'Card Charge', value: 'cardCharge' },
		{ name: 'Check', value: 'check' },
		{ name: 'Check Deposit', value: 'checkDeposit' },
		{ name: 'Donation', value: 'donation' },
		{ name: 'HCB Fee', value: 'hcbFee' },
		{ name: 'Invoice', value: 'invoice' },
		{ name: 'Organization', value: 'organization' },
		{ name: 'Reimbursed Expense', value: 'reimbursedExpense' },
		{ name: 'Transaction', value: 'transaction' },
		{ name: 'Transfer', value: 'transfer' },
		{ name: 'Wire Transfer', value: 'wireTransfer' },
		{ name: 'Wise Transfer', value: 'wiseTransfer' },
	],
	default: 'organization',
};

const orgResourcesWithGetAll = [
	'transaction',
	'cardCharge',
	'donation',
	'invoice',
	'check',
	'achTransfer',
	'transfer',
	'wireTransfer',
	'wiseTransfer',
	'checkDeposit',
	'reimbursedExpense',
	'hcbFee',
	'card',
];

const resourcesWithGet = [
	'transaction',
	'cardCharge',
	'donation',
	'invoice',
	'check',
	'achTransfer',
	'transfer',
	'wireTransfer',
	'wiseTransfer',
	'checkDeposit',
	'reimbursedExpense',
	'hcbFee',
	'card',
	'activity',
];

function operationOptionsForResource(resource: string): INodeProperties {
	if (resource === 'organization') {
		return {
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: ['organization'] } },
			options: [
				{
					name: 'Get',
					value: 'get',
					description: 'Get a single organization',
					action: 'Get an organization',
				},
				{
					name: 'Get Many',
					value: 'getAll',
					description: 'Get a list of transparent organizations',
					action: 'Get many organizations',
				},
			],
			default: 'getAll',
		};
	}

	if (resource === 'activity') {
		return {
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: ['activity'] } },
			options: [
				{
					name: 'Get',
					value: 'get',
					description: 'Get a single activity',
					action: 'Get an activity',
				},
				{
					name: 'Get Many',
					value: 'getAll',
					description: 'Get a list of recent activities',
					action: 'Get many activities',
				},
			],
			default: 'getAll',
		};
	}

	const displayNames: Record<string, string> = {
		transaction: 'Transaction',
		cardCharge: 'Card Charge',
		donation: 'Donation',
		invoice: 'Invoice',
		check: 'Check',
		achTransfer: 'ACH Transfer',
		transfer: 'Transfer',
		wireTransfer: 'Wire Transfer',
		wiseTransfer: 'Wise Transfer',
		checkDeposit: 'Check Deposit',
		reimbursedExpense: 'Reimbursed Expense',
		hcbFee: 'HCB Fee',
		card: 'Card',
	};

	const name = displayNames[resource] || resource;

	return {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: `Get a single ${name.toLowerCase()}`,
				action: `Get a ${name.toLowerCase()}`,
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: `List an organization's ${name.toLowerCase()}s`,
				action: `Get many ${name.toLowerCase()}s`,
			},
		],
		default: 'getAll',
	};
}

const organizationIdForOrgGet: INodeProperties = {
	displayName: 'Organization ID or Slug',
	name: 'organizationId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'e.g. hackclub or org_abc123',
	description: 'The organization ID or slug',
	displayOptions: {
		show: {
			resource: ['organization'],
			operation: ['get'],
		},
	},
};

const resourceIdFields: INodeProperties[] = resourcesWithGet.map((resource) => {
	const idNames: Record<string, { name: string; placeholder: string; displayName: string }> = {
		transaction: { name: 'resourceId', placeholder: 'txn_abc123', displayName: 'Transaction ID' },
		cardCharge: { name: 'resourceId', placeholder: 'chg_abc123', displayName: 'Card Charge ID' },
		donation: { name: 'resourceId', placeholder: 'don_abc123', displayName: 'Donation ID' },
		invoice: { name: 'resourceId', placeholder: 'inv_abc123', displayName: 'Invoice ID' },
		check: { name: 'resourceId', placeholder: 'chk_abc123', displayName: 'Check ID' },
		achTransfer: {
			name: 'resourceId',
			placeholder: 'ach_abc123',
			displayName: 'ACH Transfer ID',
		},
		transfer: { name: 'resourceId', placeholder: 'xfr_abc123', displayName: 'Transfer ID' },
		wireTransfer: {
			name: 'resourceId',
			placeholder: 'wir_abc123',
			displayName: 'Wire Transfer ID',
		},
		wiseTransfer: {
			name: 'resourceId',
			placeholder: 'wis_abc123',
			displayName: 'Wise Transfer ID',
		},
		checkDeposit: {
			name: 'resourceId',
			placeholder: 'cdp_abc123',
			displayName: 'Check Deposit ID',
		},
		reimbursedExpense: {
			name: 'resourceId',
			placeholder: 'rbe_abc123',
			displayName: 'Reimbursed Expense ID',
		},
		hcbFee: { name: 'resourceId', placeholder: 'bfe_abc123', displayName: 'HCB Fee ID' },
		card: { name: 'resourceId', placeholder: 'crd_abc123', displayName: 'Card ID' },
		activity: { name: 'resourceId', placeholder: 'act_abc123', displayName: 'Activity ID' },
	};

	const info = idNames[resource];

	return {
		displayName: info.displayName,
		name: info.name,
		type: 'string' as const,
		required: true,
		default: '',
		placeholder: info.placeholder,
		displayOptions: {
			show: {
				resource: [resource],
				operation: ['get'],
			},
		},
	};
});

const returnAllField: INodeProperties = {
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	description: 'Whether to return all results or only up to a given limit',
	displayOptions: {
		show: {
			operation: ['getAll'],
		},
	},
};

const limitField: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	typeOptions: { minValue: 1, maxValue: 100 },
	default: 50,
	description: 'Max number of results to return',
	displayOptions: {
		show: {
			operation: ['getAll'],
			returnAll: [false],
		},
	},
};

const expandField: INodeProperties = {
	displayName: 'Expand',
	name: 'expand',
	type: 'string',
	default: '',
	placeholder: 'e.g. organization,user',
	description:
		'Object types to expand in the API response (comma-separated). For example: organization, user, transaction.',
};

const allResources = [
	'organization',
	'activity',
	...orgResourcesWithGetAll,
];

const operationFields = [...new Set(allResources)].map((r) => operationOptionsForResource(r));

const orgIdForGetAll: INodeProperties = {
	displayName: 'Organization ID or Slug',
	name: 'organizationId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'e.g. hackclub or org_abc123',
	description: 'The organization ID or slug (the organization must have Transparency Mode enabled)',
	displayOptions: {
		show: {
			resource: orgResourcesWithGetAll,
			operation: ['getAll'],
		},
	},
};

export const hcbFields: INodeProperties[] = [
	resourceOptions,
	...operationFields,
	organizationIdForOrgGet,
	orgIdForGetAll,
	...resourceIdFields,
	returnAllField,
	limitField,
	expandField,
];
