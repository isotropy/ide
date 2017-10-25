function getHost() {
  if (process.env.LOCAL_SERVER) {
    return 'http://localhost:3000';
  }

  return process.env.NODE_ENV === 'development'
    ? '*'
    : 'looptype.com:8080';
}

export default getHost();
