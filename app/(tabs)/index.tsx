import { Button } from "@react-navigation/elements";
import { Link } from "expo-router";
import { linkTo } from "expo-router/build/global-state/routing";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { FlatList, Text, View } from "react-native";
import { db } from "../../firebase";

export interface INoteMetaData {
	id: string;
	title: string;
	text: string;
}

export default function Index() {
	const [values, loading, error] = useCollection(collection(db, "notes"));
	const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	const [notes, setNotes] = useState(data);

	useEffect(() => {
		setNotes(data);
		if (error) alert(error);
	}, [loading, values]);

	/**
	 * IMPORTANT! When creating a new note, index component does not fetch or rerender.
	 * App must be reloaded to see new db changes.
	 */
	async function createNewNote() {
		// Create empty db note entry
		let newNote = {
			title: "",
			text: "",
			coordinate: { latitude: 0, longitude: 0 },
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

	return (
		<View>
			<Text
				style={{
					fontSize: 55,
					fontWeight: 700,
				}}
			>
				Your Notes
			</Text>
			<View
				style={{
					position: "relative",
				}}
			>
				{notes?.length != 0 ? (
					<FlatList
						style={{
							paddingInline: 10,
						}}
						data={notes}
						renderItem={(note) => (
							<View
								style={{
									display: "flex",
									backgroundColor: "",
									height: 45,
									width: "100%",
									alignItems: "flex-start",
									justifyContent: "center",
								}}
							>
								<Link
									href={{
										pathname: "/note/[slug]",
										params: { slug: note.item.id },
									}}
									style={{ width: "100%" }}
								>
									<Text
										numberOfLines={1}
										style={{ fontSize: 25, textOverflow: "ellipsis" }}
									>
										{note.item.title != "" ? note.item.title : "Untitled Note"}
									</Text>
								</Link>
							</View>
						)}
					/>
				) : (
					<View
						style={{
							display: "flex",
							minHeight: 100,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							style={{
								textAlign: "center",
								textAlignVertical: "center",
								fontSize: 25,
							}}
						>
							You have no Notes
						</Text>
					</View>
				)}
				<Button onPress={createNewNote}>Create new note</Button>
			</View>
		</View>
	);
}
