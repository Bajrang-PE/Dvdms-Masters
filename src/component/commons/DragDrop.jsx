import React, { useState } from 'react';

const initialLeftItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
const initialRightItems = ['Item 5', 'Item 6'];

export default function DragDropTransfer() {
  const [leftItems, setLeftItems] = useState(initialLeftItems);
  const [rightItems, setRightItems] = useState(initialRightItems);

  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingFrom, setDraggingFrom] = useState(null);

  // New states for search filters
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const onDragStart = (item, from) => {
    setDraggingItem(item);
    setDraggingFrom(from);
  };

  const onDrop = to => {
    if (!draggingItem || draggingFrom === to) return;

    if (draggingFrom === 'left' && to === 'right') {
      setLeftItems(items => items.filter(i => i !== draggingItem));
      setRightItems(items => [...items, draggingItem]);
    } else if (draggingFrom === 'right' && to === 'left') {
      setRightItems(items => items.filter(i => i !== draggingItem));
      setLeftItems(items => [...items, draggingItem]);
    }

    setDraggingItem(null);
    setDraggingFrom(null);
  };

  const onDragOver = e => e.preventDefault();

  // Transfer selected items
  const transferLeftToRight = () => {
    setLeftItems(items => items.filter(item => !selectedLeft.includes(item)));
    setRightItems(items => [...items, ...selectedLeft]);
    setSelectedLeft([]);
  };

  const transferRightToLeft = () => {
    setRightItems(items => items.filter(item => !selectedRight.includes(item)));
    setLeftItems(items => [...items, ...selectedRight]);
    setSelectedRight([]);
  };

  // Transfer all items
  const transferAllLeftToRight = () => {
    setRightItems(items => [...items, ...leftItems]);
    setLeftItems([]);
    setSelectedLeft([]);
  };

  const transferAllRightToLeft = () => {
    setLeftItems(items => [...items, ...rightItems]);
    setRightItems([]);
    setSelectedRight([]);
  };

  const toggleSelect = (item, side) => {
    if (side === 'left') {
      setSelectedLeft(sel =>
        sel.includes(item) ? sel.filter(i => i !== item) : [...sel, item]
      );
    } else {
      setSelectedRight(sel =>
        sel.includes(item) ? sel.filter(i => i !== item) : [...sel, item]
      );
    }
  };

  // Filtered items based on search
  const filteredLeftItems = leftItems.filter(item =>
    item.toLowerCase().includes(leftSearch.toLowerCase())
  );
  const filteredRightItems = rightItems.filter(item =>
    item.toLowerCase().includes(rightSearch.toLowerCase())
  );

  return (
    <div className="dndContainer">
      {/* Left Container */}
      <div
        onDrop={() => onDrop('left')}
        onDragOver={onDragOver}
        className="dndContainer__left"
      >
        <input
          type="text"
          placeholder="Search..."
          className="dndContainer__search"
          value={leftSearch}
          onChange={e => setLeftSearch(e.target.value)}
        />
        {filteredLeftItems.map(item => (
          <div
            key={item}
            draggable
            onDragStart={() => onDragStart(item, 'left')}
            onClick={() => toggleSelect(item, 'left')}
            style={{
              backgroundColor: selectedLeft.includes(item)
                ? '#1277b5'
                : 'white',
              color: selectedLeft.includes(item) ? 'white' : 'black',
            }}
            className="dndContainer__left--item"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={transferLeftToRight}
          disabled={selectedLeft.length === 0}
          className="dndContainer__controls"
          title="Move Selected >>"
        >
          &gt;
        </button>
        <button
          onClick={transferRightToLeft}
          disabled={selectedRight.length === 0}
          className="dndContainer__controls"
          title="Move Selected <<"
        >
          &lt;
        </button>
        <hr />
        <button
          onClick={transferAllLeftToRight}
          disabled={leftItems.length === 0}
          className="dndContainer__controls"
          title="Move All >>"
        >
          &gt;&gt;
        </button>
        <button
          onClick={transferAllRightToLeft}
          disabled={rightItems.length === 0}
          className="dndContainer__controls"
          title="Move All <<"
        >
          &lt;&lt;
        </button>
      </div>

      {/* Right Container */}
      <div
        onDrop={() => onDrop('right')}
        onDragOver={onDragOver}
        className="dndContainer__right"
      >
        <input
          type="text"
          placeholder="Search..."
          className="dndContainer__search"
          value={rightSearch}
          onChange={e => setRightSearch(e.target.value)}
        />
        {filteredRightItems.map(item => (
          <div
            key={item}
            draggable
            onDragStart={() => onDragStart(item, 'right')}
            onClick={() => toggleSelect(item, 'right')}
            style={{
              backgroundColor: selectedRight.includes(item)
                ? '#1277b5'
                : 'white',
              color: selectedRight.includes(item) ? 'white' : 'black',
            }}
            className="dndContainer__right--item"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
