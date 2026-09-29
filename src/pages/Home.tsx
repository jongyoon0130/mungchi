import { Hero } from '../sections/Hero'
import { Promises } from '../sections/Promises'
import { HowItWorks } from '../sections/HowItWorks'
import { LatestBundles } from '../sections/LatestBundles'
import { Contact } from '../sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Promises />
      <HowItWorks />
      <LatestBundles />
      <Contact />
    </>
  )
}
