import { Hero } from '../sections/Hero'
import { Promises } from '../sections/Promises'
import { LatestBundles } from '../sections/LatestBundles'
import { HowItWorks } from '../sections/HowItWorks'
import { Contact } from '../sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Promises />
      <LatestBundles />
      <HowItWorks />
      <Contact />
    </>
  )
}
