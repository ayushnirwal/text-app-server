exports.isReceivedRequestExists = (myUserObj, theirUserObj) => {
  //check if their request exists in my received requests

  let receivedRequestExists = false;
  const myReceivedRequests = myUserObj.requests.received;
  myReceivedRequests.forEach((requestUserID) => {
    if (requestUserID === theirUserObj.id) {
      receivedRequestExists = true;
    }
  });

  if (!receivedRequestExists) {
    console.log(myUserObj, theirUserObj.id);
    return false;
  }

  //check if their request exists in their sent requests

  let sentRequestExists = false;
  const theirSentRequests = theirUserObj.requests.sent;
  theirSentRequests.forEach((requestUserID) => {
    if (requestUserID === myUserObj.id) {
      sentRequestExists = true;
    }
  });

  if (!sentRequestExists) {
    return false;
  }
  return true;
};
