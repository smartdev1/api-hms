window.onload = function() {
  window.ui = SwaggerUIBundle({
    url: "/api.yaml",  
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    validatorUrl: null,   
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      
      const token = localStorage.getItem('hmis_token');
      if (token) {
        req.headers['Authorization'] = 'Bearer ' + token;
      }
      return req;
    }
  });
};