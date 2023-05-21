import React from 'react'
import MainLayout from '../layouts/MainLayout'
import WriteFormModal from '../components/WriteFormModal'
import MainSection from '../components/MainSection'
import SideSection from '../components/SideSection'

const HomePage = () => {
  return (
    <MainLayout>
      {/* main section */}
      <section className="grid grid-cols-12">
        {/* main part */}
        <MainSection />
        {/* sidebar section */}
        <SideSection />
      </section>
      {/* Modal(sidebar) */}
      <WriteFormModal />
    </MainLayout>
  )
}

export default HomePage
