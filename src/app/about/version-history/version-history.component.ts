import {Component} from '@angular/core';

@Component({templateUrl: './version-history.component.html'})
export class VersionHistoryComponent {
  public versionHistory = [
    {
      number: '2.0.6',
      desc: `
            <ol>
                <li type="disc">
                    Add league chat
                </li>
                <li type="disc">
                    Teams must now request access to join a league and be approved
                </li>
                <li type="disc">
                    Fixed bugs in the league and league detail page
                </li>
                <li type="disc">
                    Fixed games not auto running on the server
                </li>
                <li type="disc">
                    Add falling down player animations for when a player is defeated
                </li>
                <li type="disc">
                    Teams can now create their own league at level 10 for $20,000
                </li>
                <li type="disc">
                    Add team experience level, increased through playing games
                </li>
                <li type="disc">
                    Reduced the round timer from 26 to 23 deconds per round
                </li>
                <li type="disc">
                    Reduced the amount of market generated players available
                </li>
            </ol>
            `
    },
    {
      number: '2.0.5',
      desc: `
            <ol>
                <li type="disc">
                    Modified rewards. As per this release it is $100 for win, $80 for tie, $60 for loss
                </li>
                <li type="disc">
                    Fix sold players not refreshing on the market after being purchased
                </li>
                <li type="disc">
                    Fix empty player slots being empty in game if a sub is available
                </li>
                <li type="disc">
                    Fix dead/injured players still able to play on the field
                </li>
                <li type="disc">
                    Market has default purchasable players that refresh each day
                </li>
                <li type="disc">
                    Player screen will show when the injury/training ends
                </li>
                <li type="disc">
                    Injured/marketed/dead/training players are not able to play, and will not turn up to their games
                </li>
                <li type="disc">
                    Injured players now lose stats, but will be playable once they have recovered
                </li>
                <li type="disc">
                    Team logos now show up on the field
                </li>
            </ol>
            `
    },
    {
      number: '2.0.4',
      tag: `<span class="tag is-success is-medium">Market Update</span>`,
      desc: `
            <ol>
                <li type="disc">
                    Add a player page to view the details of a specific player
                </li>
                <li type="disc">
                    Players now come from a country, viewable on their player card
                </li>
                <li type="disc">
                    Game interface now shows events with which players have died and been injured, as well as the score at the end of each quarter
                </li>
                <li type="disc">
                    Teams will now be awarded new players for any deaths, and a chance to recieve for injured players
                </li>
                <li type="disc">
                    Players who are injured, dead, or in the market cannot play in the games and will show up red in the <a href="/home/team/players">players screen</a>
                </li>
                <li type="disc">
                    Teams are awarded money for wins, losses, ties, and end-of-season rank
                </li>
                <li type="disc">
                    Added team money, displayed as <span class="icon">
                    <i class="fa fa-money"></i>
                </span>
                </li>
                <li type="disc">
                    Market update, able to trade and sell players on the global <a href="/market">market</a>
                </li>
                <li type="disc">
                    Able to sell a player for a default value
                </li>
                <li type="disc">
                    UI updates to the game page, will now display live or replay and it's respective colored banner
                </li>
                <li type="disc">
                    Added <a href="/about/version-history">version history</a> page
                </li>
            </ol>
            `
    },
    {
      number: '2.0.3',
      desc: `
            <ol>
                <li type="disc">
                    Leagues update, there can now be multiple leagues owned by different users and per-league enrolment
                </li>
                <li type="disc">
                    <a href="/home/team/players">Manage and save player order</a>
                </li>
                <li type="disc">
                    Auto game starting if you are on the game page
                </li>
                <li type="disc">
                    Revamped the <a href="/seasons">season</a> screen to show team logos, times, and rounds
                </li>
            </ol>
            `
    },
    {
      number: '2.0.2',
      desc: `
            <ol>
                <li type="disc">
                    Added a 'my team' page, where you have manage your team overview, players, and style
                </li>
                <li type="disc">
                    <a href="/home/team/team">Team customization</a>, now able to custom edit team uniform 
                </li>
                <li type="disc">
                    Added team logos
                </li>
                <li type="disc">
                    Added seasons
                </li>
            </ol>
            `
    },
    {
      number: '2.0.1',
      desc: `
            <ol>
                <li type="disc">
                    Added teams, users now own a team which they can manage
                </li>
                <li type="disc">
                    Added players, where multiple randomly rolled players belong to a team
                </li>
            </ol>
            `
    },
    {
      number: '2.0.0',
      desc: `
            <ol>
                <li type="disc">
                    Created the Bloodrush 2 website and base server backend
                </li>
                <li type="disc">
                    Added <a href="/home">home</a> page
                </li>
                <li type="disc">
                    Added <a href="/login">login</a> page
                </li>
                <li type="disc">
                    Added <a href="/signup">signup</a> page
                </li>
            </ol>
            `
    }
  ];
}