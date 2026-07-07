import { describe } from "zod/v4/core";

const rules = [
  // General Rules
  {
    id: "general",
    title: "General Rules",
    children: [
      {
        id: "eligibility",
        title: "1.1 Eligibility & Requirements",

        description:
          "These requirements must be met before joining Astra Roleplay.",

        rules: [
          "You must be 18+ to join and participate in this server",
          "A working, Quality mic is Required",
          "Your character must use a realistic, lore-friendly name. No offensive, meme, or TOS-violating names are allowed",
          "Only one Discord account is permitted per player. Alt accounts or impersonation may result in a ban",
          "Character names must be realistic and immersive",
        ],
      },

      {
        id: "behavior",
        title: "1.2 Behaviour & Conduct",

        description:
          "Every member is expected to contribute towards a respectful and enjoyable community.",

        rules: [
          "Any form of toxic behavior, including encouraging toxicity on Discord, Twitch, Reddit, etc., may result in removal from the community at any time. (Staff’s Discretion)",
          "Show respect to all members. No harassment, hate speech, or discrimination",
          "Do not spam messages, support tickets, or staff. Wait for resolution before re-opening",
          "Do not share private information of others without consent, except when submitting valid reports to staff",
          "Erotic or sexually explicit roleplay and content, including NSFW material, is strictly prohibited",
          "Promoting or engaging in toxic behavior inside or outside the server (e.g., Discord, Twitch, Reddit, etc.) may result in removal at staff discretion",
          "Do not attack or harass others on external platforms like YouTube, Twitter, or Discord. It reflects poorly on our community and can lead to disciplinary action",
          "Streamers or content creators must moderate their own communities. Failure to do so may lead to server penalties or bans",
        ],
      },
      {
        id: "community_rules",
        title: "1.3 Community Rules",
        rules: [
          "The Staff Team reserves the right to ban any person from our servers at any time if they are found to be disruptive, or if we have a valid reason to think that they are here to be disruptive",
          "Ban evasion is not allowed. This means that, after being banned, you may not play on other accounts to get around the ban or attempt anything to evade your ban",
          "Any threats made against any member of the community are not tolerated or Creating toxicity or spreading hate speech. Threats include but are not limited to doxxing, ddosing, etc. This is punishable by an OPFW ban. We will assist the police with any inquiries",
          "Encouraging or forcing or participating other members of the community to break rules is strictly prohibited and will share the consequence",
          "Providing false information such as your age when applying for a position/job on our servers or when asked by a staff member is not allowed. Keep in mind that staff will never ask you to provide your full name, address, or any information that is personal. NEVER provide this type of information regardless of who asks",
          "Trading real-life items for any in-game luxury is not allowed. FiveM strictly prohibits this and you will be permanently banned without appeal. Donations/support made to cover server costs is the only FiveM exemption to this rule & and while leaving server just donating you stuff which not an RP",
          "You may not advertise other communities through Astra Roleplay, nor should you advertise any products, services, or accounts for personal gain unless relevant to the server itself. A ban will be issued through the respective channel (e.g AstraRP Discord) that you were using to advertise",
        ],
      },
      {
        id: "common-sense",
        title: "1.4 Common Sense",

        description:
          "Not every situation can be covered by written rules. Staff may act against behaviour that clearly harms the server even if it is not explicitly listed.",
      },
    ],
  },
  // Server & RP Guidelines
  {
    id: "server_rp_guidelines",
    title: "Server & RP Guidelines",
    children: [
      {
        id: "basic",
        title: "2.1 Basic Rules",
        rules: [
          "Being AFK for extended periods without valid context is not allowed",
          "You must remain in character at all times unless agreed upon by all parties to pause a scene",
          "No One is allowed to share the information of any Server Meta without a Proper Roleplay",
          "Any Role-player found guilty of being involved in any kind of RMT (Real Money Trade), both parties involved in that will be Banned",
        ],
      },
      {
        id: "account_donation",
        title: "2.2 Account & Donations",
        children: [
          {
            id: "account",
            title: "2.2.1 Account Rules",
            rules: [
              "You are fully responsible for any actions taken on your Discord or in-game account. Always maintain its security and comply with community guidelines. Misuse or unauthorized activity can result in disciplinary action",
              "Buying, selling, or trading accounts or in-game valuables is strictly prohibited, unless conducted through official channels approved by the server owner. Engaging in unauthorized transactions may lead to permanent character loss, scams, or bans",
              "If you lose access to your Discord account, we cannot transfer your Allowlist status to a new account. You will need to reapply. To avoid this, we recommend enabling 2FA and securing your credentials",
            ],
          },
          {
            id: "donation",
            title: "2.2.2 Donation & Purchases",
            rules: [
              "Donation perks are bound to one specific account at the time of purchase. Once assigned, they cannot be moved or transferred to another account, so please choose carefully",
              "If you're banned for violating server rules, your purchases will not be refunded under any circumstances",
              "Any chargeback will result in an immediate, non-appealable ban. Using chargebacks to bypass moderation or refund bans is taken very seriously and will lead to permanent consequences",
              "Selling or transferring any items obtained via donation is strictly prohibited. Donation perks are for personal use only and cannot be sold or traded to others",
            ],
          },
        ],
      },
      {
        id: "character_rules",
        title: "2.3 Character Rules",
        rules: [
          "Each of your characters must have a completely separate identity. They should not share information, resources, or relationships (e.g., locations, enemies, or friends). Any blending of character knowledge or interactions is considered metagaming and will be punished accordingly",
          "All character names must be realistic and serious. Meme names, offensive names, or non-RP-friendly names will result in forced changes or administrative action without warning",
          "You may not have multiple characters affiliated with the same gang, group, or circle. Each character must have distinct alliances, goals, and interactions, to keep roleplay diverse and immersive",
          "Characters with unique or unrealistic themes (e.g., serial killers, robots, paranormal beings) require explicit approval from staff before being introduced to the server",
          "If you indicate having no pulse four or more times, your character will be considered permanently dead (perma’d). This rule encourages more meaningful injury RP and consequences",
        ],
      },
      {
        id: "roleplay_rules",
        title: "2.4 Roleplay Rules",
        children: [
          {
            id: "major_crime_around_restart",
            title: "2.4.1 Major Crimes Around Restart",
            description:
              "Engaging in any major crime (e.g., heists, violent acts against players) is prohibited within 30 minutes before or after a server restart—planned or unplanned",
            rules: [
              "If you're mid-heist when a restart happens, you must return and complete the RP after the server is back online. Abandoning it may lead to punishment",
            ],
          },
          {
            id: "ems_roleplay",
            title: "2.4.2 Respect EMS Roleplay",
            description:
              "If EMS are online, you must utilize their services rather than rushing people to the hospital yourself",
            rules: [
              "Exception: If no EMS responds within 3-5 minutes, you may proceed on your own",
              "Ignoring EMS when available is considered EMS RP denial and may result in action",
            ],
          },
          {
            id: "icu_roleplay",
            title: "2.4.3 ICU Roleplay",
            description: "If your character enters ICU (Intensive Care Unit)",
            rules: [
              "They must remain in the ICU for a minimum of 24 hours (OOC time)",
              "Only qualified EMS can clear the character to leave the ICU",
              "ICU RP is considered serious medical RP and should be treated accordingly",
            ],
          },
          {
            id: "emergency_vehicle_theft",
            title: "2.4.4 Emergency Vehicle Theft",
            rules: [
              "You can only steal EMS or Police vehicles if the scenario is supported by realistic, quality roleplay",
              "Holding up EMS/PD without any RP background just to steal a vehicle is not allowed",
            ],
          },
          {
            id: "detainment_limit",
            title: "2.4.5 Detainment Limit",
            rules: [
              "You may only detain or hold someone (handcuffed or downed) for a maximum of 15 minutes during non-engaging RP",
              "If you plan to keep them longer, you must use /looc to obtain their consent",
              "This ensures fair use of player time and prevents hostage abuse",
            ],
          },
        ],
      },
      {
        id: "criminal_roleplay_rules",
        title: "2.5 Criminal Roleplay Rules",
        description:
          "All criminal interactions must involve high-quality roleplay",
        rules: [
          "Do not focus solely on monetary gain",
          "Camping high-traffic locations (e.g., garage areas, banks) to rob players or vehicles is strictly prohibited",
          "When using a hostage during any criminal scenario (e.g., bank/store robberies) - You cannot use friends, gang members, or negotiators & Hostages must be completely uninvolved players who are unaware of your plan",
          "All robberies must be roleplay-driven, not loot-focused",
          "Do not take sentimental or irreplaceable items from a player’s inventory or vehicle",
          "Prohibited items include (but are not limited to): Character IDs, Smartwatches, Wallets, Train Passes, Tier Tickets (e.g., God Tier), Printed Pictures, Rings, Notes, Teddy Bears, Roses, etc",
          "Robbery must be more than just a /me — develop a real scene",
          "The number of participants in any criminal activity is capped at 4 total individuals",
          "Criminals or gangs may not interfere with active robberies being conducted by other groups (This includes robbing the robbers, ambushing them, or inserting into their scene without permission)",
          "You may not chain robberies without cooldowns (A 2-4 hour cooldown is required between any heists (e.g., stores, banks, jewelry))",
        ],
      },
      {
        id: "prison_rules",
        title: "2.6 Prison Rules",
        description:
          "You may attempt to interfere with prison transports under the following conditions",
        rules: [
          "The group must follow Rule 2.5 - 9th point’s participant limits",
          "The transport must be in motion from any PD to Bolingbroke Penitentiary",
          "The interaction begins once the vehicle leaves PD and ends once prisoners are inside the prison gates",
        ],
      },
      {
        id: "gang_rules",
        title: "2.7 Gang & Group Rules",
        children: [
          {
            id: "group_size_limits",
            title: "2.7.1 Group Size Limits",
            description:
              "A maximum of 4 members (6 if whitelisted) can participate in criminal activities at any time",
          },
          {
            id: "alliance_restrictions",
            title: "2.7.2 Alliance Restrictions",
            description:
              "Alliances are permitted only for economic purposes (e.g., trades, deals, joint businesses)",
            rules: [
              "Defensive pacts or merging forces during shootouts or gang fights are strictly not allowed",
            ],
          },
          {
            id: "whitelist_clothing",
            title: "2.7.3 Whitelist Clothing",
            description:
              "Anyone may wear whitelisted gang clothing if it was obtained through roleplay",
            rules: [
              "However, impersonation RP should be realistic and may carry IC consequences",
            ],
          },
          {
            id: "roleplay_before_gunplay",
            title: "2.7.4 Roleplay Before Gunplay",
            description:
              "If a situation allows for a valid roleplay outcome, it must be prioritized over initiating a shootout",
            rules: [
              "Quality roleplay > immediate violence",
              "Gunplay without roleplay buildup will be considered fail-RP or low-effort RP",
            ],
          },
          {
            id: "cooldown_between_hostilities",
            title: "2.7.5 Cooldown Between Hostilities",
            description:
              "There must be a minimum of 30 minutes before targeting the same player or group again in criminal RP",
            rules: [
              "This prevents harassment or repeated griefing and promotes more thoughtful storylines",
            ],
          },
        ],
      },
    ],
  },
  // General ROleplay RUles
  {
    id: "general_rp_rules",
    title: "General Roleplay Rules",
    children: [
      {
        id: "vdm",
        title: "3.1 Vehicle Deathmatch (VDM)",
        description:
          "Using a vehicle to intentionally harm or kill another player is strictly prohibited",
        rules: [
          "Exception: Using a vehicle defensively (e.g., escaping a threat) is situational and will be reviewed case-by-case",
          "Reckless or repeated use of vehicles as weapons will be treated as VDM",
        ],
      },
      {
        id: "rdm",
        title: "3.2 Random Deathmatch (RDM)",
        description:
          "Killing or downing someone without proper initiation or roleplay buildup is not allowed",
        rules: [
          "You must give clear, audible demands and provide ample time for the other player to respond before taking lethal action",
          "Initiation must be contextual, roleplay-based, and reasonable",
        ],
      },
      {
        id: "fear_rp",
        title: "3.3 Fear RP",
        description: "You must value your character's life at all times",
        rules: [
          "Being armed does not mean you're invincible",
          "You must show fear when outnumbered, at gunpoint, or in life-threatening situations",
          "Entering ongoing hostile scenarios (like active robberies or gunfights) without proper reason is a violation of Fear RP",
        ],
      },
      {
        id: "metagaming",
        title: "3.4 Metagaming",
        description:
          "Using information obtained outside of roleplay (e.g., Discord calls, streams, or OOC chat) to gain an in-game advantage is strictly forbidden",
        rules: [
          "Using stream sniping to track players",
          "Mixing character knowledge between your own characters",
          "Using OOC chat or third-party apps (like WhatsApp) to coordinate actions IC",
        ],
      },
      {
        id: "comabat_logging",
        title: "3.5 Combat Logging",
        description:
          "Logging out, disconnecting, or forcefully exiting the game during any active roleplay situation is considered exploitation",
        rules: [
          "This includes airlifting out (e.g., tp-ing or vanishing) mid-scene",
          "Staff will use logs and context to determine intent",
          "Always attempt to reconnect or report in #game-crash channel if disconnected unintentionally",
        ],
      },
      {
        id: "combat_stashing",
        title: "3.6 Combat Stashing",
        description:
          "Engaging in combat, looting a downed player (e.g., Player A), and then storing those items in a stash (house, vehicle, property, etc.) mid-scenario, only to return and continue fighting (e.g., with Player B) is not allowed",
      },
      {
        id: "cop_baiting",
        title: "3.7 Cop Baiting",
        rules: [
          "A player who is not involved in an ongoing police interaction purposely interfering — e.g., walking up to a traffic stop, kicking a vehicle, and running off just to attract police attention",
          "Escaping from police, then returning to the scene with the intent to escalate it into a shootout or to loot officers",
        ],
      },
      {
        id: "powergaming",
        title: "3.8 Powergaming",
        description:
          "Forcing unrealistic actions, abusing game mechanics, or RPing actions that deny fair response to others is not allowed",
        rules: [
          "Using emotes to escape restraint",
          "Forcing outcomes (e.g., I stab you instantly and you are dead)",
          "Ignoring injury roleplay or overpowering others unrealistically",
        ],
      },
      {
        id: "fail_rp",
        title: "3.9 Fail RP",
        description:
          "Avoiding or performing unrealistic, immersion-breaking RP is not allowed",
        rules: [
          "You cannot break character to point out rule violations. Use /report or clip the scene for staff review",
          "Unrealistic behavior (e.g., laughing during a shootout, ignoring major injuries) is also considered Fail-RP",
          "Calling out enemy locations, organizing allies, or giving any kind of information after being incapacitated is not allowed",
          "Driving at unrealistic high speeds repeatedly, especially without a valid character or RP reason, is prohibited",
          "If you're revived at Granny or by EMS, you may not rejoin the original RP scenario. The event ends for your character when revived",
        ],
      },
      {
        id: "nlr",
        title: "3.10 New Life Rule",
        rules: [
          "When respawning at a hospital after being downed - You must forget all events leading up to your death & You cannot return to the same scene or situation, seek revenge, or reference what happened during that scenario",
          "Your memory of the event is wiped — treat it as if your character was unconscious and left with no recollection of how they got there",
          "Important Guidelines: You cannot respawn if you’ve been told that EMS or police are en-route to your location. Doing so is considered as fail RP",
        ],
      },
      {
        id: "props_abuse",
        title: "3.11 Props Abuse",
        description:
          "Props must be used to enhance roleplay, not exploit mechanics",
        rules: [
          "You may not block doors/entrances, trap players, or force animations using props",
          "Using props solely to gain an advantage in combat or movement is not allowed",
        ],
      },
      {
        id: "stay_in_character",
        title: "3.12 Stay in-character all the times",
        rules: [
          "Always stay in-character. If there’s an issue during RP, play it out fully IC and report it later via Discord tickets. Do not confront the player or mention rules in-game",
          "Intentionally provoking other players to break RP or violate rules is strictly forbidden",
          "Just because no one is around doesn’t mean you can talk OOC with friends in the city. This includes joking, breaking immersion, or using slang that doesn’t suit your character",
          "All IC issues should be resolved within character. Do not break RP to explain or argue rules mid-situation. (Rulesplaining is not allowed)",
          "( Rulesplaining* - This refers to situations where someone breaks RP to explain rules (e.g., “Bro you can’t do that, you’ll be sent for vacation!”). This will result in punishment for both parties, regardless of intent",
        ],
      },
      {
        id: "ooc_usage",
        title: "3.13 OOC Usage",
        rules: [
          "OOC chat is strictly reserved for RP-stopping technical issues only (e.g., bugged car, crash, invisible players)",
          "Do not use /ooc for casual chat, jokes, or commentary",
          "Misuse of /ooc may lead to a ooc timeout, server kick or a ban depending on severity",
        ],
      },
      {
        id: "server_restarts",
        title: "3.14 Server Restarts",
        rules: [
          "RP should continue normally before the server restarts. Do not (goof off) or degrade RP just because a restart is incoming",
          "Avoid starting major RP situations (e.g., heists, long shootouts, PD raids) within 30 minutes of restart to prevent disruptions or resets",
        ],
      },
      {
        id: "loot_boxing",
        title: "3.15 Loot Boxing",
        description:
          "You must always initiate and complete high-quality roleplay before looting or taking items from another player (dead or alive)",
        rules: [
          "Instantly looting after a shootout without any RP",
          "Rushing to grab downed players’ weapons mid-combat",
        ],
      },
      {
        id: "ooc_bleedover",
        title: "3.16 OOC Bleedover / Blurring",
        rules: [
          "IC (In Character) and OOC (Out of Character) must be clearly separated",
          "Your character is not you, and you are not your character",
          "If someone’s character is rude or aggressive, that doesn’t mean the player dislikes you",
          "Romantic or hostile relationships between characters do not reflect real-life feelings",
          "Bleedover (feeling emotional due to your character's story) is natural and common among invested roleplayers",
          "However, the problem arises when OOC emotions influence IC decisions (or vice versa), or when players project real-life feelings into RP situations",
        ],
      },
      {
        id: "low_effort_rp",
        title: "3.17 Low Effort Roleplay",
        description:
          "Low Effort Roleplay refers to scenarios where a player shows minimal engagement, fails to build any immersive narrative, or acts without considering proper roleplay standards",
        rules: [
          "Shooting or attacking another party (criminals, civilians, or police) without any prior roleplay or initiation. This includes: No verbal warning, No tension-building RP, No negotiation or escalation",
          "Looting downed players without any meaningful RP interaction is not allowed and is considered lazy and immersion-breaking",
          "Failing to use /me to enhance roleplay or explain actions reduces immersion and will be flagged as low-effort RP",
          "Choosing to ignore Fear RP when your character should logically be afraid (e.g., facing multiple armed opponents with no backup or weapon) shows lack of realism and effort",
        ],
      },
      {
        id: "safe_zones",
        title: "3.18 Safe Zones",
        description:
          "Safe Zones are specific areas within the city where combat, hostile, or confrontational RP is strictly prohibited. These zones are meant to serve as neutral and protected spaces for healing, legal processing, and public safety (Hospital premises, Court House/City Hall premises, Police station premises)",
      },
      {
        id: "revenge_killing",
        title: "3.19 Revenge Killing",
        rules: [
          "You cannot seek revenge or initiate a new scenario against the person or group that downed you after you’ve respawned",
          "You are expected to forget all details — who did it, where it happened, or why it happened",
          "Starting a “revenge arc” post-respawn is not allowed",
        ],
      },
      {
        id: "exploiting_bugs",
        title: "3.20 Glitching & Exploiting Bugs",
        rules: [
          "Usage of any Server glitches or Exploiting Server bugs for the individual’s own advantage will lead to serious consequences",
          "Usage of any Third-party scripts is not allowed",
        ],
      },
    ],
  },
  {
    id: "whitelist_job_rules",
    title: "Whitelist Job Rules",
    children: [
      {
        id: "pd_fib_doc",
        title: "4.1 Police, FIB, DOC",
        rules: [
          "Officers are not permitted to remove items from the evidence locker for personal gain—IC or OOC. Only items marked returnable in the MDT can be taken and must be properly roleplayed",
          "Corruption RP is permitted but must be: High quality, storyline-driven, and properly escalated; Never done for senseless gain or low-effort actions (e.g., random body dumping or street-level mugging); Low-effort corruption RP may result in job removal or administrative action;",
          "Police and DOC officers must roleplay as law enforcement, not criminals. Their behavior must align with their sworn duties and uphold realistic conduct",
          "PD/DOC-specific commands must not be misused for personal or others’ benefit. All commands must be used with proper RP justification",
          "Weapons or items from the PD/DOC armory cannot be sold or distributed to non-department personnel under any circumstance",
          "FIB agents and Detectives may not investigate cases involving individuals or groups they are OOCly affiliated with (e.g., friends, gang members) to prevent metagaming or bias",
        ],
      },
      {
        id: "ems_bcfd",
        title: "4.2 EMS, BCFD",
        rules: [
          "EMS/BCFD personnel must use department commands logically and realistically",
          "Don’t use /cpr on head injuries or animals",
          "Don’t /checkin other players unless appropriate RP supports it",
          "Misusing these commands can result in job removal",
          "Items purchased from EMS/BCFD armories must not be transferred or sold to others outside of the department",
        ],
      },
      {
        id: "corruption_rp",
        title: "4.3 Corruption RP (General)",
        rules: [
          "Corruption RP is allowed, but only with high-quality, well-developed storylines",
          "Actions like body dumping, leaking classified information, or abusing commands must serve a realistic and creative RP purpose, not personal gain",
          "Whitelisted roles are privileged and are held to a higher standard. If you are caught performing low-effort or OOC-motivated corruption RP, your job and permissions may be revoked at the discretion of High Command or Staff",
        ],
      },
      {
        id: "general_expectations",
        title: "4.4 General expectations for Whitelisted Jobs",
        rules: [
          "As a whitelisted job holder, you are expected to uphold higher roleplay standards than regular players",
          "Rule violations by whitelisted members will be judged more strictly by staff",
          "You are expected to be well-versed in server rules, as your behavior reflects directly on the community and the department you represent",
        ],
      },
    ],
  },
];

export default rules;
