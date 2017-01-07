# Ideas
## Home vs Away Games
* Above a certain team level, you can upload an image of your team's top-down arena
* Live games (pre-calculate movements and everything, but send it out live)
* Money (maybe a good idea, maybe not, idk)
- Able to purchase players from lists
- Upgrade stadium
-- Random stadium names
-- Bigger venue = more capacity
-- Fans to generate income
* Use momentjs for date stuff

# Training
* Players can be put in 'training' to advance their stats
* Minimum training days (e.g. will be released from training minimum 3 days)
* Max traininable stats (e.g. an extra X%)

# Games
* * Game 'ticks' every second
* * Each tick a player has a coordinate (x, y)
* * Front-end-wise, movement is smoothed between coordinates each tick
* * (LATER ON) Medics take injured/dead off field, new players run onto field to replace them

# Players
* Player numbers
* * When a new player joins the team, they get a random number between 1-99 that is not currently assigned

# Signup
* (VALIDATION) Acronym may only include the letters in the team name

# Team Icon Generator
Generate an icon based on existing ones, or upload your own

# Game Movement and Logic
* Default move across the field
* Player Types
* * Balanced
-- Will attack if nearby, but if they get the ball they will become evasive
* * Evader
-- Avoid conflict, try to get the ball across
* * Bruiser
-- Hyper agressive
* * Chaser
-- If no direct attacker, will go for any getaways. Only playertype that will move backwards

## General Logic
Ball should only be passed to BALANCED or EVADER

# Player Market
* Players can sell to the price of their choosing

# End of Season - Player Lottery
* Talk to jared about this

# Injury / Death
* Injury has a 80% chance for loss between 2 and 8
* Injury has a 10% chance for loss between 0 and 2
* Injury has a 10% chance for loss between 8 and 40

# Misc
* Strictly one player per team
* Only show the game scores after the game has been played