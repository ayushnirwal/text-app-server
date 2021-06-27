exports.isSentRequestExists = (myUserObj, theirUserObj) => {
  //check if my request exists in my received requests

  let receivedRequestExists = false;
  const theirReceivedRequests = theirUserObj.requests.received;
  theirReceivedRequests.forEach((requestUserID) => {
    if (requestUserID === myUserObj.id) {
      receivedRequestExists = true;
    }
  });

  if (!receivedRequestExists) {
    return false;
  }

  //check if my request exists in my sent requests

  let sentRequestExists = false;
  const mySentRequests = myUserObj.requests.sent;
  mySentRequests.forEach((requestUserID) => {
    if (requestUserID === theirUserObj.id) {
      sentRequestExists = true;
    }
  });

  if (!sentRequestExists) {
    return false;
  }
  return true;
};
