To keep the server running in background, use the following command.
screen -d -m npm start

To list the available screens, use the following command.
screen -ls

To restart the session, use the following command.
screen -r [session restart]

To quit the session, use the following command.
screen -X -S [session you want to kill] quit