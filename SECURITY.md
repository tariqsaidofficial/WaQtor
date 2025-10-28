# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.34.x  | :white_check_mark: |
| < 1.34  | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

- **Email:** [support@dxbmark.com](mailto:support@dxbmark.com)
- **Subject:** [SECURITY] WaQtor - Brief description

Please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 5 business days
- **Status Updates:** Every 7 days until resolution
- **Credit:** Security researchers will be credited in the release notes

## Security Best Practices

When using WaQtor:

1. **Never commit session files** - Keep `.wwebjs_auth/` and `server/session/` in `.gitignore`
2. **Use environment variables** - Store sensitive data in `.env` files
3. **Enable HTTPS** - Always use HTTPS in production
4. **Rate limiting** - Implement rate limiting on REST API endpoints
5. **IP whitelisting** - Use Cloudflare or similar to whitelist allowed IPs
6. **Regular updates** - Keep Waqtor and all dependencies up to date
7. **Docker isolation** - Run in containerized environments
8. **Read-only mode** - Use `READONLY_FORK=true` for public deployments

## Known Limitations

### WhatsApp's Terms of Service

> [!WARNING]
> **This project operates through WhatsApp Web and is NOT officially affiliated with WhatsApp.**
> 
> - Using bots may violate WhatsApp's Terms of Service
> - Your account could be banned
> - Use at your own risk
> - Not recommended for business-critical operations

### Session Security

- Session files contain authentication tokens
- Never expose session files publicly
- Rotate sessions regularly
- Use encrypted volumes for Docker deployments

## Responsible Disclosure

We appreciate the security research community's efforts in responsibly disclosing vulnerabilities. We commit to:

- Work with security researchers to verify and address issues
- Provide credit to researchers in security advisories
- Keep researchers informed throughout the remediation process
- Release security patches promptly

Thank you for helping keep WaQtor and its users safe!

---

**WaQtor Security Team**
Maintained by Tariq Said (DXBMark)
