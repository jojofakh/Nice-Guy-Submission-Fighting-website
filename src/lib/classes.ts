/**
 * Class program copy, carried over from the current NGSF site.
 * `slug` doubles as the schedule filter key (see lib/schedule.ts).
 */
export type Discipline =
  | "jiu-jitsu"
  | "kickboxing"
  | "mma"
  | "kids"
  | "beginner"
  | "wrestling";

export type ClassProgram = {
  slug: Discipline;
  name: string;
  blurb: string;
  body: string;
  level: string;
  ages: string;
};

export const programs: ClassProgram[] = [
  {
    slug: "jiu-jitsu",
    name: "Jiu Jitsu",
    blurb: "No-Gi grappling, built to actually work.",
    body: "At Nice Guy Submission Fighting our No-Gi Jiu Jitsu program is always looking to teach the most effective grappling techniques and concepts to help you succeed on the ground. Whether you're a seasoned black belt or it's day one in the gym for you, our experienced instructors will help you navigate the world of No-Gi Jiu Jitsu and make it fun.",
    level: "All levels",
    ages: "Adults",
  },
  {
    slug: "kickboxing",
    name: "Kickboxing",
    blurb: "Not your mom's cardio kick class.",
    body: "If you're looking to play some punch face, then you've come to the right place. Our Kickboxing classes are just a little bit different than your mom's cardio kick class. But we don't just spar hard, we teach and drill technique that's proven to work in real combat situations. Whether you have aspirations of being a striking master or just want to learn how to throw a punch, our Kickboxing classes have something for you. But we be sparring hard on Wednesdays doe.",
    level: "All levels",
    ages: "Adults",
  },
  {
    slug: "mma",
    name: "MMA",
    blurb: "Stand up, ground and pound, everything between.",
    body: "There's no telling where a fight will go. It's best to be able to mix it up. From stand up to ground and pound and everything in between, our MMA classes will help you improve your game to stay in the fight. Come learn how to blend Kickboxing, Wrestling, and Jiu Jitsu techniques together that'll be effective at every level from amateur MMA to the UFC.",
    level: "Intermediate to advanced",
    ages: "Adults",
  },
  {
    slug: "kids",
    name: "Kids Classes",
    blurb: "Don't let them wish they'd started sooner.",
    body: "Everyone you meet on the mats says the same thing: “I wish I would've started when I was younger.” Don't have your kiddo making the same wish. Get them involved in Jiu Jitsu today! Jiu Jitsu is a fun way for kids to learn a new skill, make friends, get in shape, and overcome real life obstacles in a safe environment. Nice Kids Submission Fighting is always accepting new teammates!",
    level: "Beginner friendly",
    ages: "Ages 6+",
  },
  {
    slug: "beginner",
    name: "Beginner Classes",
    blurb: "Every black belt was once a white belt.",
    body: "Every black belt was once a white belt. Every professional fighter was an amateur before. If you're not sure where to start on your martial arts journey, come try a beginner class!",
    level: "Day one welcome",
    ages: "Adults",
  },
  {
    slug: "wrestling",
    name: "Wrestling",
    blurb: "Everything starts from the feet.",
    body: "Everything starts from the feet. From an MMA fight to a grappling match, it'd be beneficial to know what to do from the standing position. Come learn how to dictate where the fight goes with our experienced instructors!",
    level: "All levels",
    ages: "Adults",
  },
];

export const programBySlug = new Map(programs.map((p) => [p.slug, p]));
