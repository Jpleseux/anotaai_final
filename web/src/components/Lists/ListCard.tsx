import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from '../../types/api';
import { formatDate } from '../../utils/date';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Clipboard, ClipboardList } from 'lucide-react';

interface ListCardProps {
  list: List;
}

const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const navigate = useNavigate();
  const itemCount = list.items?.length || 0;

  const handleClick = () => {
    navigate(`/lists/${list.id}`);
  };

  return (
    <Card 
      className="h-full transition-all hover:shadow-md"
      hoverable
      onClick={handleClick}
    >
      <CardHeader className="flex items-start justify-between pb-2">
        <CardTitle className="truncate">{list.name}</CardTitle>
        <div className="rounded-full p-2 bg-teal-50 text-teal-600">
          {itemCount > 0 ? (
            <ClipboardList size={18} />
          ) : (
            <Clipboard size={18} />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {formatDate(list.createdAt)}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListCard;