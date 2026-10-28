import Script from "next/script"

const CLARITY_ID = "z3tg3fw544"

/** Microsoft Clarity on the public site, auth pages and portal; never in the admin. Production builds only. */
export function Clarity() {
  if (process.env.NODE_ENV !== "production") return null
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
    </Script>
  )
}
