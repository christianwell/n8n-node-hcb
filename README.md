# n8n-nodes-hcb

This is an unofficial [n8n](https://n8n.io/) community node for the [HCB (Hack Club Bank) Transparency API](https://hcb.hackclub.com/docs/api/v3).

This node is **not affiliated with or endorsed by Hack Club**. It is a community-built integration that lets you read public financial data from HCB organizations that have [Transparency Mode](https://blog.hcb.hackclub.com/posts/transparent-finances-optional-feature-151427) enabled.

**No authentication required** — the HCB API is a public, read-only API.

[n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Resources

The node supports the following resources:

| Resource | Operations |
| --- | --- |
| **Organization** | Get, Get Many |
| **Transaction** | Get, Get Many (by org) |
| **Card Charge** | Get, Get Many (by org) |
| **Donation** | Get, Get Many (by org) |
| **Invoice** | Get, Get Many (by org) |
| **Check** | Get, Get Many (by org) |
| **ACH Transfer** | Get, Get Many (by org) |
| **Transfer** | Get, Get Many (by org) |
| **Wire Transfer** | Get, Get Many (by org) |
| **Wise Transfer** | Get, Get Many (by org) |
| **Check Deposit** | Get, Get Many (by org) |
| **Reimbursed Expense** | Get, Get Many (by org) |
| **HCB Fee** | Get, Get Many (by org) |
| **Card** | Get, Get Many (by org) |
| **Activity** | Get, Get Many |

## Usage

1. Add the **HCB** node to your workflow.
2. Select a **Resource** (e.g., Organization, Transaction).
3. Select an **Operation** (Get or Get Many).
4. For "Get Many" operations on organization sub-resources, provide the **Organization ID or Slug** (e.g., `hackclub`, `hq`).
5. For "Get" operations, provide the resource ID.
6. Optionally use the **Expand** field to include related objects in the response (e.g., `organization,user`).

### Example: List all transactions for an organization

1. Resource: **Transaction**
2. Operation: **Get Many**
3. Organization ID: `hq`
4. Return All: `true`

## Compatibility

- n8n >= 1.0.0
- Node.js >= 18

## License

[MIT](LICENSE.md)
