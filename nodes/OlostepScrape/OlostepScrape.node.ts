import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';

export class OlostepScrape implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Olostep Web Scraper',
		name: 'olostepScrape',
		icon: 'file:olostep.svg',
		group: ['transform'],
		version: 1,
		description: 'Extract content from any website using Olostep\'s powerful web scraping API',
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
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scrape',
						value: 'scrape',
					},
					{
						name: 'Batch',
						value: 'batch',
					},
					{
						name: 'Crawl',
						value: 'crawl',
					},
					{
						name: 'Map',
						value: 'map',
					},
				],
				default: 'scrape',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['scrape'],
					},
				},
				options: [
					{
						name: 'Scrape Website',
						value: 'create',
						description: 'Extract content from a single URL',
						action: 'Scrape a URL',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Perform a Google search and get structured results',
						action: 'Search',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['batch'],
					},
				},
				options: [
					{
						name: 'Batch Scrape URLs',
						value: 'create',
						description: 'Scrape up to 10k URLs at the same time',
						action: 'Batch scrape ur ls',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['crawl'],
					},
				},
				options: [
					{
						name: 'Create Crawl',
						value: 'create',
						description: 'Get the content of subpages of a URL',
						action: 'Create a crawl',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['map'],
					},
				},
				options: [
					{
						name: 'Create Map',
						value: 'create',
						description: 'Get all URLs on a website',
						action: 'Create a map',
					},
				],
				default: 'create',
			},
			// Scrape Website fields
			{
				displayName: 'URL to Scrape',
				name: 'url_to_scrape',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'https://example.com',
				description: 'The URL of the website you want to scrape. Must include http:// or https://.',
			},
			{
				displayName: 'Output Format',
				name: 'formats',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'HTML',
						value: 'html',
					},
					{
						name: 'Markdown',
						value: 'markdown',
					},
					{
						name: 'JSON',
						value: 'json',
					},
					{
						name: 'Plain Text',
						value: 'text',
					},
				],
				default: 'markdown',
				description: 'Choose the format for the scraped content output',
			},
			{
				displayName: 'Country Code',
				name: 'country',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'US',
				description: 'Optional country code (e.g., US, GB, CA) for location-specific scraping',
			},
			{
				displayName: 'Wait Before Scraping (Milliseconds)',
				name: 'wait_before_scraping',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 10000,
				},
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'Wait time in milliseconds before scraping (useful for dynamic content)',
			},
			{
				displayName: 'Parser',
				name: 'parser',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '@olostep/amazon-product',
				description: 'Optional parser ID for specialized content extraction (e.g., @olostep/amazon-product)',
			},
			// Search fields
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['search'],
					},
				},
				default: '',
				placeholder: 'What is the capital of US?',
				description: 'Search query for Google',
			},
			// Batch Scrape fields
			{
				displayName: 'URLs to Scrape',
				name: 'batch_array',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['batch'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '[{"url":"https://example.com","custom_id":"site1"}]',
				description: 'JSON array of objects with URL and custom_id fields',
			},
			{
				displayName: 'Output Format',
				name: 'formats',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['batch'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'HTML',
						value: 'html',
					},
					{
						name: 'Markdown',
						value: 'markdown',
					},
					{
						name: 'JSON',
						value: 'json',
					},
					{
						name: 'Plain Text',
						value: 'text',
					},
				],
				default: 'markdown',
				description: 'Choose the format for the scraped content output',
			},
			{
				displayName: 'Country Code',
				name: 'country',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['batch'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'US',
				description: 'Optional country code (e.g., US, GB, CA) for location-specific scraping',
			},
			{
				displayName: 'Wait Before Scraping (Milliseconds)',
				name: 'wait_before_scraping',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 10000,
				},
				displayOptions: {
					show: {
						resource: ['batch'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'Wait time in milliseconds before scraping each URL (useful for dynamic content)',
			},
			{
				displayName: 'Parser',
				name: 'parser',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['batch'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '@olostep/amazon-product',
				description: 'Optional parser ID for specialized content extraction',
			},
			// Crawl fields
			{
				displayName: 'Start URL',
				name: 'start_url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['crawl'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'https://example.com',
				description: 'The starting URL for the crawl. Must include http:// or https://.',
			},
			{
				displayName: 'Maximum Pages',
				name: 'max_pages',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						resource: ['crawl'],
						operation: ['create'],
					},
				},
				default: 10,
				description: 'Maximum number of pages to crawl (default: 10)',
			},
			{
				displayName: 'Follow Links',
				name: 'follow_links',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['crawl'],
						operation: ['create'],
					},
				},
				default: true,
				description: 'Whether to follow links found on pages (default: true)',
			},
			{
				displayName: 'Output Format',
				name: 'formats',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['crawl'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'HTML',
						value: 'html',
					},
					{
						name: 'Markdown',
						value: 'markdown',
					},
					{
						name: 'JSON',
						value: 'json',
					},
					{
						name: 'Plain Text',
						value: 'text',
					},
				],
				default: 'markdown',
				description: 'Format for scraped content',
			},
			{
				displayName: 'Country Code',
				name: 'country',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['crawl'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'US',
				description: 'Optional country code (e.g., US, GB, CA) for location-specific crawling',
			},
			{
				displayName: 'Parser',
				name: 'parser',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['crawl'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '@olostep/amazon-product',
				description: 'Optional parser ID for specialized content extraction',
			},
			// Map fields
			{
				displayName: 'Website URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['map'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'https://example.com',
				description: 'The website URL to extract links from. Must include http:// or https://.',
			},
			{
				displayName: 'Search Query',
				name: 'search_query',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['map'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'blog',
				description: 'Optional search query to filter URLs (e.g., "blog")',
			},
			{
				displayName: 'Top N URLs',
				name: 'top_n',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						resource: ['map'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Limit the number of URLs returned',
			},
			{
				displayName: 'Include URL Patterns',
				name: 'include_urls',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['map'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '/blog/**',
				description: 'Glob patterns to include specific paths (e.g., "/blog/**")',
			},
			{
				displayName: 'Exclude URL Patterns',
				name: 'exclude_urls',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['map'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '/admin/**',
				description: 'Glob patterns to exclude specific paths (e.g., "/admin/**")',
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
					const formats = this.getNodeParameter('formats', i, 'markdown') as string;
					const country = this.getNodeParameter('country', i, '') as string;
					const wait_before_scraping = this.getNodeParameter('wait_before_scraping', i, 0) as number;
					const parser = this.getNodeParameter('parser', i, '') as string;

					const data: IDataObject = {
						url_to_scrape,
						formats: [formats],
					};

					if (country) {
						data.country = country;
					}
					if (wait_before_scraping) {
						data.wait_before_scraping = wait_before_scraping;
					}
					if (parser) {
						data.parser = { id: parser };
					}

					const options: IHttpRequestOptions = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'POST',
						body: data,
						url: 'https://api.olostep.com/v1/scrapes',
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'olostepScrapeApi', options);
					const result = responseData as IDataObject;
					const scrapeResult = result.result as IDataObject | undefined;
					
					// Return all available content formats
					returnData.push({
						json: {
							id: result.id || `scrape_${Date.now()}`,
							url: result.url_to_scrape || url_to_scrape,
							markdown_content: scrapeResult?.markdown_content || null,
							html_content: scrapeResult?.html_content || null,
							json_content: scrapeResult?.json_content || null,
							text_content: scrapeResult?.text_content || null,
							status: 'completed',
							timestamp: new Date().toISOString(),
							formats: formats,
							...(country && { country }),
							...(parser && { parser }),
							object: result.object,
							created: result.created,
							retrieve_id: result.retrieve_id,
							screenshot_hosted_url: scrapeResult?.screenshot_hosted_url || null,
							markdown_hosted_url: scrapeResult?.markdown_hosted_url || null,
							html_hosted_url: scrapeResult?.html_hosted_url || null,
							json_hosted_url: scrapeResult?.json_hosted_url || null,
							text_hosted_url: scrapeResult?.text_hosted_url || null,
							page_metadata: scrapeResult?.page_metadata || null,
						},
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
						url: 'https://api.olostep.com/v1/scrapes',
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'olostepScrapeApi', options);
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
			} else if (resource === 'batch') {
				if (operation === 'create') {
					const batch_array = this.getNodeParameter('batch_array', i) as string;
					const formats = this.getNodeParameter('formats', i, 'markdown') as string;
					const country = this.getNodeParameter('country', i, '') as string;
					const wait_before_scraping = this.getNodeParameter('wait_before_scraping', i, 0) as number;
					const parser = this.getNodeParameter('parser', i, '') as string;

					// Parse batch_array if it's a string
					let parsedBatchArray;
					if (typeof batch_array === 'string') {
						try {
							parsedBatchArray = JSON.parse(batch_array);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON format for batch array. Expected: [{"url":"https://example.com","custom_id":"test1"}]');
						}
					} else {
						parsedBatchArray = batch_array;
					}

					if (!Array.isArray(parsedBatchArray) || parsedBatchArray.length === 0) {
						throw new NodeOperationError(this.getNode(), 'Batch array is required and must contain at least one URL');
					}

					if (parsedBatchArray.length > 100000) {
						throw new NodeOperationError(this.getNode(), 'Batch array cannot exceed 100,000 URLs');
					}

					const data: IDataObject = {
						items: parsedBatchArray,
						formats: [formats],
					};

					if (country) {
						data.country = country;
					}
					if (wait_before_scraping) {
						data.wait_before_scraping = wait_before_scraping;
					}
					if (parser) {
						data.parser = { id: parser };
					}

					const options: IHttpRequestOptions = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'POST',
						body: data,
						url: 'https://api.olostep.com/v1/batches',
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'olostepScrapeApi', options);
					
					returnData.push({
						json: {
							batch_id: responseData.batch_id || responseData.id || `batch_${Date.now()}`,
							status: responseData.status || 'processing',
							total_urls: parsedBatchArray.length,
							created_at: new Date().toISOString(),
							...(formats && { formats }),
							...(country && { country }),
							...(parser && { parser }),
							urls: parsedBatchArray.map((item: IDataObject) => ({
								custom_id: item.custom_id || item.id,
								url: item.url,
							})),
						},
						pairedItem: { item: i },
					});
				}
			} else if (resource === 'crawl') {
				if (operation === 'create') {
					const start_url = this.getNodeParameter('start_url', i) as string;
					const max_pages = this.getNodeParameter('max_pages', i, 10) as number;
					const follow_links = this.getNodeParameter('follow_links', i, true) as boolean;
					const formats = this.getNodeParameter('formats', i, 'markdown') as string;
					const country = this.getNodeParameter('country', i, '') as string;
					const parser = this.getNodeParameter('parser', i, '') as string;

					const data: IDataObject = {
						start_url,
						max_pages,
						follow_links,
						formats: [formats],
					};

					if (country) {
						data.country = country;
					}
					if (parser) {
						data.parser = { id: parser };
					}

					const options: IHttpRequestOptions = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'POST',
						body: data,
						url: 'https://api.olostep.com/v1/crawls',
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'olostepScrapeApi', options);
					
					returnData.push({
						json: {
							crawl_id: responseData.id || responseData.crawl_id || `crawl_${Date.now()}`,
							object: responseData.object || 'crawl',
							status: responseData.status || 'in_progress',
							start_url: start_url,
							max_pages: max_pages,
							follow_links: follow_links,
							created: responseData.created || Date.now(),
							...(formats && { formats }),
							...(country && { country }),
							...(parser && { parser }),
						},
						pairedItem: { item: i },
					});
				}
			} else if (resource === 'map') {
				if (operation === 'create') {
					const url = this.getNodeParameter('url', i) as string;
					const search_query = this.getNodeParameter('search_query', i, '') as string;
					const top_n = this.getNodeParameter('top_n', i, '') as number | string;
					const include_urls = this.getNodeParameter('include_urls', i, '') as string;
					const exclude_urls = this.getNodeParameter('exclude_urls', i, '') as string;

					const data: IDataObject = {
						url,
					};

					if (search_query) {
						data.search_query = search_query;
					}
					if (top_n) {
						data.top_n = typeof top_n === 'string' ? parseInt(top_n) : top_n;
					}
					if (include_urls) {
						data.include_urls = Array.isArray(include_urls) ? include_urls : [include_urls];
					}
					if (exclude_urls) {
						data.exclude_urls = Array.isArray(exclude_urls) ? exclude_urls : [exclude_urls];
					}

					const options: IHttpRequestOptions = {
						headers: {
							'Accept': 'application/json',
						},
						method: 'POST',
						body: data,
						url: 'https://api.olostep.com/v1/maps',
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'olostepScrapeApi', options);
					
					returnData.push({
						json: {
							map_id: responseData.id || responseData.map_id || `map_${Date.now()}`,
							object: responseData.object || 'map',
							url: url,
							total_urls: responseData.total_urls || (responseData.urls ? responseData.urls.length : 0),
							urls: responseData.urls || [],
							...(search_query && { search_query }),
							...(top_n && { top_n: typeof top_n === 'string' ? parseInt(top_n) : top_n }),
						},
						pairedItem: { item: i },
					});
				}
			}
		}
		return [returnData];
	}
}
