export const getRequestHost = () => {
    const host = window.location.host;
  
    if (host.includes('creatorzhub.com') || host.includes('localhost')) {
      return { type: 'subdomain', host: host.split('.')[0] };
    }
  
    const { hostname } = new URL(`https://${host}`);
    const domain = hostname.replace(/^(?:https?:\/\/)?(?::www\.)?/i, '').split('/')[0];
  
    return {
      type: 'domain',
      host: domain,
    };
  };
  