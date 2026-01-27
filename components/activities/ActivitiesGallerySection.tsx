/**
 * Gallery Carousel Component
 * Uses Swiper for robust sliding, matching Chelnox Portfolio design
 * Includes rigorous 404 prevention for missing images
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import SectionHeader from '@/components/shared/SectionHeader'
import { getPublicContentBySection, type GalleryItem } from '@/actions/admin/publicContent'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

export default function ActivitiesGallerySection() {
    const [isVisible, setIsVisible] = useState(false)
    const [images, setImages] = useState<{ id: number; src: string; caption: string }[]>([])
    const [loading, setLoading] = useState(true)
    const sectionRef = useRef<HTMLElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    // Check screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Fetch gallery data
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const result = await getPublicContentBySection('gallery')
                if (result.success && result.data?.content?.items) {
                    const dbItems: GalleryItem[] = result.data.content.items

                    // Sanitize paths immediately to prevent 404 requests
                    // If the DB has 'slider-image', assume it's broken unless proven otherwise
                    // The user confirmed these files are missing
                    const mappedImages = dbItems.map((item, index) => {
                        let validSrc = item.image_url || '/images/smbsd-bg-hd.jpg'

                        if (validSrc.includes('slider-image')) {
                            validSrc = '/images/smbsd-bg-hd.jpg'
                        }

                        return {
                            id: index + 1,
                            src: validSrc,
                            caption: item.caption || `Kegiatan ${index + 1}`
                        }
                    })

                    setImages(mappedImages)
                }
            } catch (error) {
                console.error('Error fetching gallery:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchGallery()
    }, [])

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    const sectionBgColor = '#E57526'

    return (
        <section
            id="gallery"
            ref={sectionRef}
            className="py-12 md:py-16 relative overflow-hidden scroll-mt-40 min-h-[50vh] flex flex-col justify-center"
            style={{
                backgroundColor: sectionBgColor
            }}
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern-batik.png')] bg-repeat opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                {/* Section Title */}
                <SectionHeader
                    title="Galeri Kegiatan"
                    color="#ffffff"
                    isVisible={isVisible}
                    className="mb-8 md:mb-12"
                />

                {loading ? (
                    <div className="text-center text-white py-12">Loading...</div>
                ) : images.length === 0 ? (
                    <div className="text-center text-white py-12 opacity-70">
                        Belum ada gambar galeri. Silakan tambahkan melalui halaman admin.
                    </div>
                ) : (
                    <div className="relative">
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            initialSlide={Math.floor(images.length / 2)}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 2.5,
                                slideShadows: false,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true
                            }}
                            navigation={{
                                prevEl: '.swiper-button-prev-custom',
                                nextEl: '.swiper-button-next-custom',
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            loop={true}
                            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                            className="gallery-swiper !pb-14"
                        >
                            {images.map((image) => (
                                <SwiperSlide
                                    key={image.id}
                                    className="!w-[280px] !h-[280px] sm:!w-[400px] sm:!h-[300px] md:!w-[600px] md:!h-[400px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border-4 border-white bg-white"
                                >
                                    <div className="w-full h-full relative group">
                                        <Image
                                            src={image.src}
                                            alt={image.caption}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.srcset = ""
                                                target.src = "/images/smbsd-bg-hd.jpg"
                                            }}
                                        />

                                        {/* Caption Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 pointer-events-none">
                                            <p className="text-white font-bold text-lg px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                {image.caption}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons (Outside Swipe Area for Desktop) */}
                        <div className="hidden md:flex items-center justify-center gap-8 mt-4">
                            <button className="swiper-button-prev-custom w-12 h-12 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#E57526] flex items-center justify-center transition-all duration-300 z-10 cursor-pointer">
                                <ChevronLeft size={24} />
                            </button>
                            <button className="swiper-button-next-custom w-12 h-12 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#E57526] flex items-center justify-center transition-all duration-300 z-10 cursor-pointer">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .gallery-swiper .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.5);
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                    transition: all 0.3s;
                }
                .gallery-swiper .swiper-pagination-bullet-active {
                    background: #ffffff;
                    width: 30px;
                    border-radius: 5px;
                }
                .gallery-swiper .swiper-slide {
                    filter: blur(2px) brightness(0.7);
                    transform: scale(0.9);
                    transition: all 0.5s ease;
                }
                .gallery-swiper .swiper-slide-active {
                    filter: blur(0px) brightness(1);
                    transform: scale(1);
                    z-index: 10;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                }
            `}</style>
        </section>
    )
}
