import React, { useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph-2d';

export default function BrainGraph({ todos, notes }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const nodes = [];
    const links = [];

    // Add Todo nodes
    if (todos) {
      todos.forEach(todo => {
        nodes.push({
          id: `todo-${todo.Id}`,
          name: todo.Name,
          group: 'todo',
          color: todo.IsComplete ? '#4caf50' : '#2196f3',
          val: 10
        });
      });
    }

    // Add Note nodes and links
    if (notes) {
      notes.forEach(note => {
        const noteId = `note-${note.id}`;
        nodes.push({
          id: noteId,
          name: note.content,
          group: 'note',
          color: '#ff9800',
          val: 5
        });

        if (note.linkedTodoIds) {
          note.linkedTodoIds.forEach(todoId => {
            links.push({
              source: noteId,
              target: `todo-${todoId}`
            });
          });
        }
      });
    }

    setGraphData({ nodes, links });
  }, [todos, notes]);

  return (
    <div style={{ width: '100%', height: '400px', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', background: '#f9f9f9', marginTop: '20px' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        nodeVal="val"
        width={400}
        height={400}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
      />
    </div>
  );
}
