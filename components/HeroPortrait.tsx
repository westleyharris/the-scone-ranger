import Image from "next/image";
import { Sancreek, Special_Elite } from "next/font/google";

/*
  Poster type, loaded here so only the home page pays for it. Both are free (Google Fonts,
  OFL / Apache) stand-ins until the client confirms the real fonts:
  - Sancreek, a spurred Western display face, for WANTED and REWARD, after the sticker's RANGER
  - Special Elite, a worn typewriter face, for the name, after the business card
*/
const posterDisplay = Sancreek({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poster-display",
});

const posterTypewriter = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poster-typewriter",
});

/**
 * Home hero: The Scone Ranger on a letterpress WANTED broadside, hung from one nail.
 * Wording is the client's (November 2026 feedback). The Orange Cranberry scone
 * sits off the lower-left corner, below the centred reward.
 * Every measure is in em off .wanted-wrap, so the lockup scales as one piece.
 *
 * Period art, both public domain (Wikimedia Commons), no credit required:
 * - pointing hands: "GPO Index 9 1891", a US Government Printing Office type ornament
 *   (public/images/ornaments/pointing-hand-1891.svg, recoloured to the poster ink)
 * - scene behind the portrait: "Spokane Falls, W.T." engraving, 1882, cropped to two
 *   panels and toned (public/images/poster-spokane-falls.jpg)
 */
export function HeroPortrait() {
  return (
    <div className="hero-stage">
      <div className={`wanted-wrap ${posterDisplay.variable} ${posterTypewriter.variable}`}>
        <figure className="wanted">
          <PosterSheet />
          <span className="wanted-nail" aria-hidden="true" />

          <p className="wanted-title">Wanted</p>
          <p className="wanted-charge">
            <Pointer side="left" />
            <span>for scones that are not dry</span>
            <Pointer side="right" />
          </p>

          {/*
            Cropped from Dave's separated business-card art (scone-ranger-separated.jpeg)
            to the rope oval and stamp. Its white ground multiplies away into the paper.
          */}
          <div className="wanted-photo">
            {/*
              Spokane Falls either side of the portrait. Built to this art's exact geometry:
              it is blank wherever the rope oval and stamp sit, so it never shows through them.
            */}
            <Image
              src="/images/poster-spokane-falls.jpg"
              alt=""
              aria-hidden="true"
              width={1214}
              height={593}
              sizes="(min-width: 640px) 410px, 75vw"
              loading="eager"
              className="wanted-scene"
            />
            <Image
              src="/images/scone-ranger-poster.jpg"
              alt="The Scone Ranger: a pencil portrait of a smiling masked cowboy in a rope frame, stamped “Surprisingly moist scones”"
              width={660}
              height={941}
              sizes="(min-width: 640px) 260px, 50vw"
              loading="eager"
              fetchPriority="high"
              className="wanted-photo-img"
            />
          </div>

          <figcaption>
            <p className="wanted-name">The Scone Ranger</p>
            <div className="wanted-reward">
              <p className="wanted-reward-title">Reward</p>
              {/* Breaks after the ellipsis; the second half wraps on its own. */}
              <p className="wanted-reward-line">
                <span className="block">Dozens of crave-worthy flavors…</span>
                regardless of most dietary restrictions
              </p>
            </div>
          </figcaption>
        </figure>

        <Image
          src="/images/hero-orange-cranberry-cutout.png"
          alt=""
          aria-hidden="true"
          width={1100}
          height={824}
          sizes="(min-width: 640px) 190px, 40vw"
          loading="eager"
          className="scone-arrive hero-scone"
        />
      </div>
    </div>
  );
}

/** A printer's pointing hand at the end of a tapered rule, aimed at the line it flanks. */
function Pointer({ side }: { side: "left" | "right" }) {
  return (
    <span className="wanted-pointer" data-side={side} aria-hidden="true">
      <i className="wanted-pointer-rule" />
      <Image src="/images/ornaments/pointing-hand-1891.svg" alt="" width={494} height={244} className="wanted-pointer-hand" />
    </span>
  );
}

/**
 * The sheet itself. No viewBox, so the filter works in real pixels:
 * a slow warp roughs the cut edge, fine noise adds fibre, and the
 * blurred outside-alpha tans the margins the way old paper ages.
 * Don't put a CSS filter on this svg: it re-rasters the cut edge soft.
 */
function PosterSheet() {
  return (
    <svg className="wanted-paper" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="wanted-sheet" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#f4e7cd" />
          <stop offset="0.55" stopColor="#eddcbb" />
          <stop offset="1" stopColor="#e5d0aa" />
        </linearGradient>
        <filter
          id="wanted-deckle"
          x="-4%"
          y="-3%"
          width="108%"
          height="106%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.028 0.04" numOctaves="3" seed="8" result="warp" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="sheet"
          />

          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="23" result="fibre" />
          <feColorMatrix
            in="fibre"
            type="matrix"
            values="0 0 0 0 0.42  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.5 -0.19"
            result="fibreInk"
          />
          <feComposite in="fibreInk" in2="sheet" operator="in" result="grain" />

          <feComponentTransfer in="sheet" result="outside">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur in="outside" stdDeviation="11" result="outsideSoft" />
          <feComposite in="outsideSoft" in2="sheet" operator="in" result="edgeMask" />
          <feFlood floodColor="#8a6434" floodOpacity="0.5" result="edgeInk" />
          <feComposite in="edgeInk" in2="edgeMask" operator="in" result="edge" />

          {/* Contact shadow, kept in this filter so it hugs the cut edge. */}
          <feOffset in="sheet" dy="1.2" result="dropped" />
          <feGaussianBlur in="dropped" stdDeviation="1.1" result="droppedSoft" />
          <feFlood floodColor="#2a211c" floodOpacity="0.32" result="shadowInk" />
          <feComposite in="shadowInk" in2="droppedSoft" operator="in" result="contact" />

          <feMerge>
            <feMergeNode in="contact" />
            <feMergeNode in="sheet" />
            <feMergeNode in="grain" />
            <feMergeNode in="edge" />
          </feMerge>
        </filter>
      </defs>
      <rect x="1%" y="0.8%" width="98%" height="98.4%" fill="url(#wanted-sheet)" filter="url(#wanted-deckle)" />
    </svg>
  );
}
