export const fetchCardData = async (url) => {
    try {
      const headers = new Headers();
      headers.append('Accept', 'application/json');
  
      const response = await fetch(url, { 
          method: 'GET',
          headers: headers,
          mode: 'cors',
          cache: 'default' 
        });  
      const json = await response.json();
      return json.data;
    } catch (error) {
      throw error;
    }
  }