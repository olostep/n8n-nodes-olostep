import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OlostepScrapeApi implements ICredentialType {
	name = 'olostepScrapeApi';
	displayName = 'Olostep Scrape API';
	documentationUrl = 'https://www.olostep.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.olostep.com',
			url: '/v1/scrapes',
			method: 'POST',
			body: {
				url_to_scrape: 'https://example.com',
			},
		},
	};
}
