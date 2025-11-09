# n8n-nodes-olostep

This is an n8n community node. It lets you use the Olostep APIs in your n8n workflows to search, extract, and structure web data.

Olostep is the best web scraping, crawling, and search API for AI. Extract structured web data from any website in real time and automate research workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Workflow Template](#workflow-template)  
[Testing Locally](#testing-locally)  
[Publishing to npm](#publishing-to-npm)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Or install directly via npm:

```bash
npm install n8n-nodes-olostep
```

Then restart n8n to load the new node.

## Operations

### Scrape Website

Extract content from a single URL in multiple formats (HTML, Markdown, JSON, or Plain Text).

**Parameters:**
- **URL to Scrape** (required): The URL of the website you want to scrape
- **Output Format**: Choose format (HTML, Markdown, JSON, or Plain Text) - default: Markdown
- **Country Code**: Optional country code (e.g., US, GB, CA) for location-specific scraping
- **Wait Before Scraping**: Wait time in milliseconds before scraping (0-10000) - useful for dynamic content
- **Parser**: Optional parser ID for specialized extraction (e.g., @olostep/amazon-product)

**Output Fields:**
- `id`: Scrape ID
- `url`: Scraped URL
- `markdown_content`: Markdown formatted content
- `html_content`: HTML formatted content
- `json_content`: JSON formatted content
- `text_content`: Plain text content
- `status`: Status of the scrape
- `timestamp`: Timestamp of the scrape
- `screenshot_hosted_url`: URL to screenshot (if available)
- `page_metadata`: Page metadata

### Search Google

Perform a Google search for a given query and returns structured results.

**Parameters:**
- **Query** (required): Search query for Google

**Output:** Returns structured search results as JSON.

### Batch Scrape URLs

Process up to 100,000 URLs in parallel. Perfect for large-scale data extraction.

**Parameters:**
- **URLs to Scrape** (required): JSON array of objects with `url` and `custom_id` fields
  - Example: `[{"url":"https://example.com","custom_id":"site1"}]`
- **Output Format**: Choose format for all URLs - default: Markdown
- **Country Code**: Optional country code for location-specific scraping
- **Wait Before Scraping**: Wait time in milliseconds before scraping each URL
- **Parser**: Optional parser ID for specialized extraction

**Output Fields:**
- `batch_id`: Batch ID (use this to retrieve results later)
- `status`: Status of the batch
- `total_urls`: Total number of URLs in the batch
- `created_at`: Creation timestamp
- `formats`: Requested format
- `country`: Country code used
- `parser`: Parser used
- `urls`: Array of URLs in the batch

### Create Crawl

Autonomously discover and scrape entire websites by following links. Perfect for documentation sites, blogs, and content repositories.

**Parameters:**
- **Start URL** (required): Starting URL for the crawl
- **Maximum Pages**: Maximum number of pages to crawl (default: 10)
- **Follow Links**: Whether to follow links found on pages (default: true)
- **Output Format**: Format for scraped content - default: Markdown
- **Country Code**: Optional country code for location-specific crawling
- **Parser**: Optional parser ID for specialized content extraction

**Output Fields:**
- `crawl_id`: Crawl ID (use this to retrieve results later)
- `object`: Object type
- `status`: Status of the crawl
- `start_url`: Starting URL
- `max_pages`: Maximum pages
- `follow_links`: Whether links are followed
- `created`: Creation timestamp
- `formats`: Formats requested
- `country`: Country code used
- `parser`: Parser used

### Create Map

Extract all URLs from a website for content discovery and site structure analysis.

**Parameters:**
- **Website URL** (required): Website URL to extract links from
- **Search Query**: Optional search query to filter URLs (e.g., "blog")
- **Top N URLs**: Limit the number of URLs returned
- **Include URL Patterns**: Glob patterns to include specific paths (e.g., "/blog/**")
- **Exclude URL Patterns**: Glob patterns to exclude specific paths (e.g., "/admin/**")

**Output Fields:**
- `map_id`: Map ID
- `object`: Object type
- `url`: Website URL
- `total_urls`: Total URLs found
- `urls`: Array of discovered URLs
- `search_query`: Search query used
- `top_n`: Top N limit

## Credentials

To use this node, you need to authenticate with the Olostep Scrape API.

1. Sign up for an account on [olostep.com](https://www.olostep.com) to get an API key.
2. Add a new credential in n8n for the Olostep Scrape API.
3. Enter your API key in the 'API Key' field.

## Workflow Template

A sample workflow template is included in `workflow-template.json`. To use it:

1. Open n8n
2. Click on "Workflows" in the sidebar
3. Click the three dots menu and select "Import from File"
4. Select the `workflow-template.json` file
5. Configure the Olostep credentials
6. Customize the workflow as needed

The template includes a basic workflow that scrapes a website using the Olostep Scrape Website operation.

## Testing Locally

To test your node locally before publishing:

### Prerequisites

- Node.js version 20.15 or higher
- npm installed

### Steps

1. **Build the node:**
   ```bash
   npm run build
   ```

2. **Link the node locally:**
   ```bash
   npm link
   ```

3. **Install n8n globally (if not already installed):**
   ```bash
   npm install n8n -g
   ```

4. **Link the node to n8n:**
   ```bash
   # Find your n8n custom nodes directory (usually ~/.n8n/custom/)
   # Or if using n8n locally, navigate to the n8n installation directory
   cd ~/.n8n/custom
   npm link n8n-nodes-olostep
   ```

5. **Start n8n:**
   ```bash
   n8n start
   ```

6. **Test the node:**
   - Open n8n in your browser (usually http://localhost:5678)
   - Create a new workflow
   - Add the "Olostep Scrape" node
   - Configure it with your API credentials
   - Test each operation to ensure they work correctly

### Running Linter

Before publishing, make sure your code passes linting:

```bash
npm run lint
```

If there are any issues, fix them:

```bash
npm run lintfix
```

## Publishing to npm

Once your node is tested and ready:

### Prerequisites

- npm account (create one at [npmjs.com](https://www.npmjs.com/signup) if needed)
- Node.js version 20.15 or higher

### Steps

1. **Ensure package.json is correct:**
   - Verify version number
   - Check that all required fields are filled
   - Ensure the package name is `n8n-nodes-olostep`

2. **Build the package:**
   ```bash
   npm run build
   ```

3. **Run prepublish checks:**
   ```bash
   npm run prepublishOnly
   ```
   This will build and lint your code.

4. **Login to npm:**
   ```bash
   npm login
   ```
   Enter your npm username, password, and email when prompted.

5. **Publish to npm:**
   ```bash
   npm publish
   ```

6. **Verify publication:**
   - Visit https://www.npmjs.com/package/n8n-nodes-olostep
   - Check that your latest version is published

### Version Management

When making updates:

1. Update the version in `package.json` following [semantic versioning](https://semver.org/):
   - **Patch** (1.0.0 → 1.0.1): Bug fixes
   - **Minor** (1.0.0 → 1.1.0): New features, backward compatible
   - **Major** (1.0.0 → 2.0.0): Breaking changes

2. Update the CHANGELOG.md (if you have one)

3. Build and publish:
   ```bash
   npm run build
   npm publish
   ```

## Compatibility

This node is tested against n8n version 1.x and requires Node.js version 20.15 or higher.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Olostep API Documentation](https://docs.olostep.com)
* [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
* [npm Package Documentation](https://docs.npmjs.com/)
