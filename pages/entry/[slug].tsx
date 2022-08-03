import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getPlant, QueryStatus } from '@api'

import { AuthorCard } from '@components/AuthorCard'
import { Layout } from '@components/Layout'
import { RichText } from '@components/RichText'
import { Grid, Typography } from '@material-ui/core'

const PlantEntryPage = () => {
  // const [status, setStatus] =
  // useState<'success' | 'error' | 'loading' | 'idle'>('idle')
  const [status, setStatus] = useState<QueryStatus>('idle')
  const [plant, setPlant] = useState<Plant | null>(null)
  const router = useRouter()
  const slug = router.query.slug

  useEffect(() => {
    if (typeof slug !== 'string') {
      return
    }

    setStatus('loading')
    getPlant(slug)
      .then((reciveData) => {
        setPlant(reciveData)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [slug])

  if (status === 'loading' || status === 'idle') {
    return (
      <Layout>
        <main>Loading awesomeness...</main>
      </Layout>
    )
  }
  if (plant == null || status === 'error') {
    return (
      <Layout>
        <main>Not Found, error 404 my friend.</main>
      </Layout>
    )
  }

  return (
    <Layout>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={9} component="article">
          <figure>
            <img width={952} src={plant.image.url} alt={plant.image.title} />
          </figure>
          <div className="px-12 pt-8">
            <Typography variant="h2">{plant.plantName}</Typography>
          </div>
          <div className="p-10">
            <RichText richText={plant.description} />
          </div>
        </Grid>
        <Grid item xs={12} md={4} lg={3} component="aside">
          <section>
            <Typography className="mb-4" variant="h5" component="h3">
              Recent posts
            </Typography>
          </section>
          <section className="m-t10">
            <Typography className="mb-4" variant="h5" component="h3">
              Categories
            </Typography>
          </section>
        </Grid>
      </Grid>
      <section className="my-4 border-t-2 border-b-2 border-gray-200 pt-12 pb-7">
        <AuthorCard {...plant.author} />
      </section>
    </Layout>
  )
}

export default PlantEntryPage
