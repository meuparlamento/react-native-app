# INSTALL
# make sure you have python3 environment
# 
# requirements
# pip install git+https://github.com/expo-community/expo-server-sdk-python
# pip install requests

from exponent_server_sdk import DeviceNotRegisteredError
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
from exponent_server_sdk import PushResponseError
from exponent_server_sdk import PushServerError
from requests.exceptions import ConnectionError
from requests.exceptions import HTTPError
import uuid


# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.
def send_push_message(token, message, extra, topic):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        body=message,
                        data=extra,
                        title=topic,
                        display_in_foreground=True))
    except PushServerError as exc:
        # Encountered some likely formatting/validation error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'errors': exc.errors,
                'response_data': exc.response_data,
            })
        raise
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        rollbar.report_exc_info(
            extra_data={'token': token, 'message': message, 'extra': extra})
        raise self.retry(exc=exc)

    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # Mark the push token as inactive
        from notifications.models import PushToken
        PushToken.objects.filter(token=token).update(active=False)
    except PushResponseError as exc:
        # Encountered some other per-notification error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'push_response': exc.push_response._asdict(),
            })
        raise self.retry(exc=exc)

# unique UUID to be send with push notification data
uniqueID = str(uuid.uuid4())
print(uniqueID)

proposal = {
    "id": uniqueID,
    "type": "proposal",
}

result = {
    # pass id which previously sent with proposal notification
    "id": "8c202817-28e8-4210-a01e-43d5a04eecc8",
    # type to distinguish notification type
    "type": "results",
    # dummy votes results
    "votes": {
        "BE": 3,
        "CDS_PP": 4,
        "PAN": 2,
        "PCP": 4,
        "PEV": 5,
        "PS": 3,
        "PSD": 4
    }
}

# payload to be passed with notification
data = result

# Proposal type notification
send_push_message(
    "ExponentPushToken[keQCxxL8Hda2uvVUDitr5K]",
    "New proposal is available vote now.",
    data,
    "Proposal"
)

# Result type notification
send_push_message(
    "ExponentPushToken[keQCxxL8Hda2uvVUDitr5K]",
    "Results is available for recent proposal.",
    data,
    "Results"
)