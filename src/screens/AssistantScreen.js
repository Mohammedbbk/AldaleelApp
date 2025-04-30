const handleSendMessage = async () => {
  if (!message.trim()) return;

  try {
    setIsLoading(true);
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    const response = await fetch('http://localhost:3000/api/trips/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        context: {
          userId: 'user123', // Replace with actual user ID
          tripId: selectedTrip?.id,
          location: {
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from assistant');
    }

    const data = await response.json();
    
    if (data.status === 'success') {
      const assistantMessage = {
        id: Date.now() + 1,
        text: data.data.response,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        metadata: data.data.metadata,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } else {
      throw new Error(data.error || 'Failed to get response from assistant');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    const errorMessage = {
      id: Date.now() + 1,
      text: `Error: ${error.message}`,
      sender: 'system',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
}; 