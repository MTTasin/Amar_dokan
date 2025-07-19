import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useAxios = (url) => {
  const { user } = useSelector((state) => state.auth);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {},
        };

        if (user && user.access) {
          config.headers['Authorization'] = `JWT ${user.access}`;
        }

        const res = await axios.get(url, config);
        setResponse(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, user]);

  return { response, error, loading };
};

export default useAxios;
  
