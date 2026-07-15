import { BriefcaseBusiness, Command, UserRound } from "lucide-react";
import { describe } from "zod";

const guides = [
  {
    slug: "commands",
    title: "Commands & Keybinds",
    description:
      "Learn all essential commands and keyboard shortcuts used throughout Astra Roleplay.",
    icon: Command,
    sections: [
      {
        title: "Communication and Interaction Commands",
        items: [
          {
            name: "/ooc",
            description: "Out of Character chat",
          },
          {
            name: "/looc",
            description: "Local Out of Character chat",
          },
          {
            name: "/me",
            description: "Display an action you're doing",
          },
          {
            name: "/report",
            description: "Report a player or situation to staff",
          },
          {
            name: "/carry",
            description: "Carry the closest player",
          },
          {
            name: "/trunk",
            description: "Access the vehicle trunk",
          },
          {
            name: "/door",
            description: "Open a vehicle's door",
          },
          {
            name: "/seat 1-6",
            description: "Switch to a different seat inside a vehicle",
          },
          {
            name: "/cls",
            description: "Clear your OOC chat",
          },
          {
            name: "/ooc on/off",
            description: "Turn on/off your OOC",
          },
          {
            name: "/crosshair",
            description: "Enables crosshair while shooting/aiming",
          },
          {
            name: "/cinematic",
            description: "Set black bars for a cinematic shot",
          },
          {
            name: "/playtime",
            description: "Check your current playtime",
          },
          {
            name: "/leaderboard",
            description: "Check the server leaderboard",
          },
          {
            name: "/do",
            description: "Show/narrate texts or roleplay actions",
          },
        ],
      },

      {
        title: "Property Commands",
        items: [
          {
            name: "/furniture",
            description: "Furnish House",
          },
          {
            name: "/knock",
            description: "Knock on a door",
          },
          {
            name: "/enter",
            description: "Enter a house",
          },
        ],
      },

      {
        title: "Mechanic Job Specific Commands",
        items: [
          {
            name: "/tow",
            description: "Tow/Untow vehicle",
          },
        ],
      },

      {
        title: "Vehicle Commands",
        items: [
          {
            name: "/engine",
            description: "Toggle Engine",
          },
          {
            name: "/door 1-6",
            description: "Open/Close Doors",
          },
          {
            name: "/window 1-6",
            description: "Window Up/Down",
          },
          {
            name: "/seat 1-6",
            description: "Switch to a different seat",
          },
          {
            name: "/givekey {serverId}",
            description: "To give vehicle keys to nearby players",
          },
          {
            name: "/grab_keys",
            description: "Grab physical keys of vehicle",
          },
          {
            name: "/shuffle",
            description: "Shift to side seat",
          },
          {
            name: "/givecar {serverId} {Plate Number}",
            description: "Transfer ownership of a PDM car",
          },
        ],
      },

      {
        title: "Race Commands",
        items: [
          {
            name: "/race_start {amount} [delay]",
            description:
              "Start a race for money using waypoint or recorded checkpoints",
          },
          {
            name: "/race_cancel",
            description:
              "Cancel a created race before it starts and refund money",
          },
          {
            name: "/race_leave",
            description: "Withdraw from the active race (no refunds)",
          },
          {
            name: "/race_record",
            description:
              "Record checkpoints using map (Set waypoints on the map to create checkpoints)",
          },
          {
            name: "/race_clear",
            description: "Clear recorded checkpoints",
          },
          {
            name: "/race_save {name}",
            description: "Save recorded checkpoints with name",
          },
          {
            name: "/race_load {name}",
            description: "Load recorded checkpoints with name",
          },
          {
            name: "/race_delete {name}",
            description: "Delete recorded checkpoints with name",
          },
          {
            name: "/race_list",
            description: "List saved races",
          },
          {
            name: "/race_checkpoints",
            description: "Toggle race checkpoints",
          },
          {
            name: "/race_sounds",
            description: "Toggle race sounds",
          },
        ],
      },

      {
        title: "Keyboard Shortcuts",
        items: [
          {
            name: "P",
            description: "Open Phone",
          },
          {
            name: "K",
            description: "Access Inventory",
          },
          {
            name: "F3",
            description: "Access Animations/Emotes/WalkStyles",
          },
          {
            name: "U",
            description: "See players online and their player IDs",
          },
          {
            name: "E/Third Eye (Hold Alt)",
            description: "Interact",
          },
          {
            name: "Y",
            description:
              "Change your voice range (whispering/talking/shouting)",
          },
          {
            name: "Left Ctrl",
            description: "Crouch",
          },
          {
            name: "N",
            description: "Default push-to-talk key",
          },
          {
            name: "Z",
            description: "Prone",
          },
          {
            name: "1-5",
            description: "Use the items in your hot bar",
          },
          {
            name: "Tab",
            description: "Access Hotbar",
          },
          {
            name: "R",
            description: "Punch/Reload",
          },
          {
            name: "C",
            description: "Look Behind",
          },
          {
            name: "V",
            description: "Camera Adjustment",
          },
        ],
      },
    ],
  },
];

export default guides;
