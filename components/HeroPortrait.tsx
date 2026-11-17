import Image from "next/image";

/**
 * Home hero: the owners on a letterpress WANTED broadside, hung from one nail.
 * The reward is the Orange Cranberry scone from the story ("love at first bite").
 * Every measure is in em off .wanted-wrap, so the lockup scales as one piece.
 */
export function HeroPortrait() {
  return (
    <div className="hero-stage">
      <div className="wanted-wrap">
        <figure className="wanted">
          <PosterSheet />
          <span className="wanted-nail" aria-hidden="true" />

          <p className="wanted-title">Wanted</p>
          <p className="wanted-charge">
            <span>for baking scones that aren’t dry</span>
          </p>

          <div className="wanted-photo">
            <Image
              src="/images/hero-scone.jpg"
              alt="David and Evelyn Ainley, the owners of The Scone Ranger"
              width={2048}
              height={1155}
              sizes="(min-width: 640px) 600px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="wanted-photo-img"
            />
          </div>

          <figcaption>
            <p className="wanted-name">Mr. &amp; Mrs. Scone Ranger</p>
            <p className="wanted-aka">a.k.a. David &amp; Evelyn Ainley · Spokane</p>
            <div className="wanted-reward">
              <p className="wanted-reward-title">Reward</p>
              <p className="wanted-reward-line">Love at first bite</p>
            </div>
          </figcaption>
        </figure>

        <Image
          src="/images/hero-orange-cranberry.png"
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
