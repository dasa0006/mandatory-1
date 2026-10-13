import { db } from "@/firebase";
import { linkTo } from "expo-router/build/global-state/routing";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export interface INoteMetaData {
	id: string;
	title: string;
	text: string;
	coordinate: {
		latitude: number;
		longitude: number;
	};
}

interface IMap {
	noteProps: INoteMetaData;
	isModal: boolean;
	setSetLocationModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Map(mapProps?: IMap) {
	// Default orientation of map view
	const region = {
		latitude: 55.4,
		longitude: 12,
		latitudeDelta: 2,
		longitudeDelta: 2,
	};

	const [values, loading, error] = useCollection(collection(db, "notes"));
	const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	const [notes, setNotes] = useState(data);

	useEffect(() => {
		// alert(JSON.stringify(data));
		setNotes(data);
		if (error) alert(error);
	}, [loading, values]);

	/**
	 * App must be reloaded to see new db changes.
	 */
	async function createNewNote(noteMetaData) {
		let newNote = {
			title: "",
			text: "",
			coordinate: noteMetaData,
		};

		try {
			let r = await addDoc(collection(db, "notes"), newNote);
			setNotes((item) => [...item, newNote]);

			// Isolate ID from collection name to get noteID
			// NOTE!!! If collection name "notes" changes, this will break!!
			const noteID = r.path.replace("notes/", "");
			linkTo({
				pathname: "/note/[slug]",
				params: { slug: noteID },
			});
		} catch (error) {
			alert(error);
		}
	}

	async function updateNoteWithCoords(coordinate) {
		let id = mapProps?.noteProps?.id;
		if (!id) {
			alert("ID of note is not available");
			return;
		}
		await updateDoc(doc(db, "notes", id), {
			coordinate: coordinate,
		});
	}

	async function handleLongPress(event) {
		const { coordinate } = event.nativeEvent; // hent kun coordinate objekt

		if (mapProps?.isModal) {
			alert("Marker created from existing note");
			await updateNoteWithCoords(coordinate);
			mapProps.setSetLocationModalVisible(false);
		} else {
			// alert("No existing note for marker");
			await createNewNote(coordinate);
		}
	}

	return (
		<View style={styles.container}>
			<MapView style={styles.map} region={region} onLongPress={handleLongPress}>
				{notes &&
					notes.map((note, index) => (
						<Marker
							key={index}
							coordinate={{
								latitude: note.coordinate.latitude,
								longitude: note.coordinate.longitude,
							}}
							title={note.title != "" ? note.title : "Untitled Note"}
							description={note.text.substring(0, 8) + "..."}
						/>
					))}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: "100%",
		height: "100%",
	},
});
