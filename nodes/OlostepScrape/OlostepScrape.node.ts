import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class OlostepScrape implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Olostep Web Scraper',
		name: 'olostepScrape',
		icon: 'file:olostep.svg',
		group: ['transform'],
		version: 1,
		description: 'Search Google and extract content from web',
		defaults: {
			name: 'Olostep Scrape',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'olostepScrapeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'hidden',
				default: 'scrape',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scrape URL',
						value: 'create',
						description: 'Scrape a URL',
						action: 'Scrape a url',
					},
					{
						name: 'Search Google',
						value: 'search',
						action: 'Search google',
					},
				],
				default: 'create',
			},
			{
				displayName: 'URL to Scrape',
				name: 'url_to_scrape',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'scrape',
						],
					},
				},
				default:'',
				placeholder: 'https://example.com',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'search',
						],
						resource: [
							'scrape',
						],
					},
				},
				default: '',
				placeholder: 'What is the capital of US?',
				description: 'Search query for Google',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			if (resource === 'scrape') {
				if (operation === 'create') {
					const url_to_scrape = this.getNodeParameter('url_to_scrape', i) as string;
					const data: IDataObject = {
						url_to_scrape,
						formats: ['markdown'],
					};

					const options: IHttpRequestOptions = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'POST',
						body: data,
						url: `https://api.olostep.com/v1/scrapes`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'olostepScrapeApi', options);
					const result = responseData as IDataObject;
					const scrapeResult = result.result as IDataObject | undefined;
					const markdownContent = scrapeResult?.markdown_content as string | undefined;
					returnData.push({
						json: { markdown: markdownContent ?? null },
						pairedItem: { item: i },
					});
				} else if (operation === 'search') {
					const query = this.getNodeParameter('query', i) as string;
					const data: IDataObject = {
						url_to_scrape: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
						formats: ['json'],
						parser: {
							id: '@olostep/google-search',
						},
					};

					const options: IHttpRequestOptions = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'POST',
						body: data,
						url: `https://api.olostep.com/v1/scrapes`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(this, 'olostepScrapeApi', options);
					const result = responseData.result as IDataObject | undefined;
					const jsonContent = result?.json_content;

					if (jsonContent) {
						let parsedData;
						if (typeof jsonContent === 'string') {
							try {
								parsedData = JSON.parse(jsonContent);
							} catch (error) {
								// If it's not a valid JSON string, treat it as plain text.
								parsedData = { value: jsonContent };
							}
						} else {
							parsedData = jsonContent;
						}

						const itemsToReturn = Array.isArray(parsedData) ? parsedData : [parsedData];
						returnData.push(...itemsToReturn.map(item => ({
							json: item,
							pairedItem: { item: i },
						})));
					}
				}
			}
		}
		return [returnData];
	}
}
