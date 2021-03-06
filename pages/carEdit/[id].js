import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { AiFillCar } from "react-icons/ai";
import {
	Textarea,
	Input,
	FormLabel,
	Icon,
	Box,
	chakra,
	Container,
	Stack,
	Text,
	Image,
	Flex,
	VStack,
	Button,
	Heading,
	SimpleGrid,
	StackDivider,
	useColorModeValue,
	VisuallyHidden,
	List,
	ListItem,
	HStack,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BsTrashFill } from "react-icons/bs";
import cars from "../cars";
import { FiSave } from "react-icons/fi";
import { AiOutlineConsoleSql } from "react-icons/ai";
import {
	oneCarForId,
	postAllPhotos,
	UpdateCarFetch,
} from "../../constantes/constantes";
import GlobalContext from "../../context/GlobalContext";
import PopUpModal from "../../components/PopUpModal";
import ContainerHF from "../../components/ContainerHF";
import NeedSession from "../../components/NeedSession";

export default function IndividualCar({ car }) {
	const [updateCar, setUpdateCar] = useState(car);
	const router = useRouter();
	const { setToken, token, tokenFunction } = useContext(GlobalContext);

	const { id } = router.query;

	return (
		<ContainerHF>
			<Box>
				{token ? (
					<CarDetail car={updateCar} setUpdateCar={setUpdateCar}></CarDetail>
				) : (
					<NeedSession></NeedSession>
				)}
			</Box>
		</ContainerHF>
	);
}
//OBTENGO EL AUTO CON EL ID ESPESIFICO
export const getServerSideProps = async (context) => {
	const res = await fetch(
		`http://localhost:4000/cars/findOneForId/${context.query.id}`
	);
	const resJson = await res.json();
	const datos = resJson;

	return { props: { car: datos } };
};

//ESTE COMPONENTE CONTIENE AL CARROUSEL Y EL FORM QUE SIRVE PARA EDITAR
function CarDetail({ car, setUpdateCar }) {
	const { name: model, description, price } = car;
	return (
		<Container maxW={"7xl"}>
			<SimpleGrid
				columns={{ base: 1, lg: 2 }}
				spacing={{ base: 8, md: 10 }}
				py={{ base: 18, md: 24 }}
			>
				<Flex>
					<Box w={"100%"} h={{ base: "100%", sm: "400px", lg: "500px" }}>
						<Carrousel car={car} setUpdateCar={setUpdateCar}></Carrousel>
					</Box>
				</Flex>

				<UpdateCar car={car} setUpdateCar={setUpdateCar}></UpdateCar>
			</SimpleGrid>
		</Container>
	);
}

//ESTE CARROUSEL CONTIENE UN BOTON PARA BORRAR LA IMAGEN QUE SE DESEA
function Carrousel({ car, setUpdateCar }) {
	const { setModalContent, modalContent } = useContext(GlobalContext);
	const { images, price, description, model, _id } = car;

	//DELETE IMG
	const deleteImage = (imagenId) => {
		console.log(imagenId);
		const imagesDelete = images?.filter((item) => item._id !== imagenId);
		const carUpdate = { _id, model, price, description, images: imagesDelete };
		UpdateCarFetch(carUpdate, _id);
		setModalContent("Photo Delete");
		setTimeout(() => {
			setModalContent("");
			oneCarForId(_id).then((x) => setUpdateCar(x));
		}, 1000);
	};

	const arrImages = images?.map((item) => {
		return { img: `http://localhost:4000/cars/uploads/${item.name}` };
	});
	const arrowStyles = {
		cursor: "pointer",
		pos: "absolute",
		top: "50%",
		w: "auto",
		mt: "-22px",
		p: "16px",
		color: "white",
		fontWeight: "bold",
		fontSize: "18px",
		transition: "0.6s ease",
		borderRadius: "0 3px 3px 0",
		userSelect: "none",
		_hover: {
			opacity: 0.8,
			bg: "teal",
		},
	};

	const slides = arrImages;

	const [currentSlide, setCurrentSlide] = useState(0);

	const slidesCount = slides.length;

	const prevSlide = () => {
		setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
	};
	const nextSlide = () => {
		setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
	};
	const setSlide = (slide) => {
		setCurrentSlide(slide);
	};
	const carouselStyle = {
		transition: "all 3s",
		ml: `-${currentSlide * 100}%`,
	};

	return (
		<Flex
			w="full"
			bg="#ffff"
			_dark={{ bg: "#3e3e3e" }}
			p={10}
			alignItems="center"
			justifyContent="center"
		>
			<Flex w="full" overflow="hidden" pos="relative">
				<PopUpModal modalContent={modalContent}></PopUpModal>
				<Flex
					h={slidesCount > 1 ? "500px" : "400px"}
					w="full"
					{...carouselStyle}
				>
					{slides.map((slide, sid) => (
						<Box key={`slide-${sid}`} boxSize="full" shadow="md" flex="none">
							<Box display="flex" justifyContent="center">
								{slidesCount > 1 && (
									<Button
										onClick={() => deleteImage(images[sid]._id)}
										rounded={"none"}
										w={"50"}
										size={"lg"}
										p={"7"}
										bg={useColorModeValue(100, 200)}
										color={useColorModeValue("white", "gray")}
										textTransform={"uppercase"}
										leftIcon={<FiSave w={5} h={5} />}
										_hover={{
											// transform: "translateY(2px)",
											// boxShadow: "lg",
											transform: "translateY(10px)",

											bg: 200,
										}}
									>
										Delete
									</Button>
								)}
							</Box>

							<Text
								opacity={0.6}
								borderRadius={"30px"}
								mt={"2px"}
								ml={"2px"}
								bg="teal"
								color="white"
								fontSize="large"
								p="8px 12px"
								pos="absolute"
								top={slidesCount > 1 ? "60px" : "0"}
							>
								{sid + 1} / {slidesCount}
							</Text>

							<Image
								src={slide.img}
								alt="carousel image"
								boxSize="full"
								objectFit="cover"
								// transition="all 5s"
								// filter={currentSlide === sid ? "blur(0)" : "grayscale(100%)"}
							/>
						</Box>
					))}
				</Flex>
				{slidesCount > 1 && (
					<Text {...arrowStyles} left="0" onClick={prevSlide}>
						&#10094;
					</Text>
				)}
				{slidesCount > 1 && (
					<Text {...arrowStyles} right="0" onClick={nextSlide}>
						&#10095;
					</Text>
				)}

				<HStack justify="center" pos="absolute" bottom="8px" w="full">
					{slides.map((_, slide) => (
						<Box
							key={`dots-${slide}`}
							cursor="pointer"
							boxSize={["7px", null, "15px"]}
							m="0 2px"
							bg={currentSlide === slide ? "blackAlpha.800" : "blackAlpha.500"}
							rounded="50%"
							display="inline-block"
							transition="background-color 0.6s ease"
							_hover={{ bg: "blackAlpha.800" }}
							onClick={() => setSlide(slide)}
						></Box>
					))}
				</HStack>
			</Flex>
		</Flex>
	);
}

//EN ESTE FORM SE PUEDEN EDITAR TODOS LOS DATOS TANTO LAS IMAGENES COMO EL TE
function UpdateCar({ car, setUpdateCar }) {
	const { _id, name: model, description, price, images } = car;
	const refForm = useRef();
	const router = useRouter();
	const { push } = router;
	const { modalContent, setModalContent } = useContext(GlobalContext);

	const fetchPost = async (car, _id, preveousCar) => {
		const { current: form } = refForm;
		const formData = new FormData(form);
		const file = formData.get("file");
		const namesPhotos = await postAllPhotos(formData);

		if (!file.name) {
			UpdateCarFetch({ ...car, images: images }, _id);
		} else {
			UpdateCarFetch({ ...car, images: namesPhotos }, _id);
		}
		setModalContent("Car Updated Successfully");

		setTimeout(() => {
			oneCarForId(_id).then((x) => setUpdateCar(x));
			setModalContent("");
		}, 1000);
	};

	const handleSumbit = (car) => {
		const { current: form } = refForm;
		const formData = new FormData(form);
		const name = formData.get("name");
		const description = formData.get("description");
		const price = formData.get("price");
		const file = formData.get("file");

		if (formData && name && description && price) {
			const carUpdateForm = {
				name,
				description,
				price: parseInt(price),
			};
			fetchPost(carUpdateForm, _id, car);
		} else {
			setModalContent("Missing data to complete");
			setTimeout(() => {
				setModalContent("");
			}, 1000);
		}
	};

	return (
		<Box
			mt={"2rem"}
			position={"relative"}
			w={"full"}
			backgroundPosition={"25% 50%"}
		>
			<PopUpModal modalContent={modalContent}></PopUpModal>

			<Container
				as={SimpleGrid}
				maxW={"7xl"}
				columns={{ base: 1, md: 1 }}
				spacing={{ base: 2, lg: 2 }}
				py={{ base: 1, sm: 1, lg: 1 }}
			>
				<Stack spacing={{ base: 1, md: 1 }}>
					<Stack direction={"row"} spacing={4} align={"center"}></Stack>
				</Stack>
				<Stack
					bg={"gray.50"}
					boxShadow={"dark-lg"}
					rounded={"xl"}
					p={{ base: 2, sm: 3, md: 4 }}
					spacing={{ base: 4 }}
					maxW={{ lg: "lg" }}
				>
					<Stack spacing={4}>
						<Heading
							color={"gray.800"}
							lineHeight={1.1}
							fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
						>
							Edit your car specifications
						</Heading>
						<Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
							Welcome to the car editing section, In this section you can edit
							delete and add more images
						</Text>
					</Stack>
					<Box as={"form"} mt={10} ref={refForm}>
						<Stack spacing={4}>
							{/* <form ref={refForm}> */}

							<FormLabel>Model</FormLabel>
							<Input
								required
								placeholder="Model"
								defaultValue={model}
								name="name"
								bg={"gray.100"}
								border={0}
								color={"gray.500"}
								_placeholder={{
									color: "gray.500",
								}}
							/>

							<FormLabel>Description</FormLabel>
							<Textarea
								defaultValue={description}
								required
								placeholder="Description"
								name="description"
								bg={"gray.100"}
								border={0}
								color={"gray.500"}
								_placeholder={{
									color: "gray.500",
								}}
							/>
							<FormLabel>Price</FormLabel>
							<Input
								required
								defaultValue={price}
								name="price"
								type={"number"}
								placeholder="Price"
								bg={"gray.100"}
								border={0}
								color={"gray.500"}
								_placeholder={{
									color: "gray.500",
								}}
							/>

							<Input
								required
								type={"file"}
								name="file"
								placeholder="Upload Img"
								bg={"gray.100"}
								border={0}
								color={"gray.500"}
								_placeholder={{
									color: "gray.500",
								}}
								multiple
							/>
							<Button
								// type="submit"
								onClick={() => handleSumbit(car)}
								rounded={"none"}
								w={"full"}
								mt={8}
								size={"lg"}
								p={"7"}
								bg={useColorModeValue(100, 200)}
								color={useColorModeValue("white", "gray")}
								textTransform={"uppercase"}
								leftIcon={<FiSave w={5} h={5} />}
								_hover={{
									// transform: "translateY(2px)",
									// boxShadow: "lg",
									transform: "translateY(10px)",

									bg: 200,
								}}
							>
								Update Info
							</Button>
							{/* </form> */}
						</Stack>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
